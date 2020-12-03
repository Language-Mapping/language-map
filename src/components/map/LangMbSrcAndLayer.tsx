import React, { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { AnyLayout, Expression } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import {
  useSymbAndLabelState,
  useMapToolsDispatch,
  LangConfig,
} from 'components/context'
import { configEndpoints } from 'components/spatial/config'
import { RawSheetsResponse } from 'components/config/types'
import { asyncAwaitFetch, prepEndoFilters } from './utils'
import { sheetsToJSON } from '../../utils'

import * as config from './config'
import * as Types from './types'

const { mbStyleTileConfig, langLabelsStyle, CONFIG_QUERY_ID } = config

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const LangMbSrcAndLayer: FC<Types.LangMbSrcAndLayerProps> = ({
  symbLayers,
}) => {
  const symbLabelState = useSymbAndLabelState()
  const mapToolsDispatch = useMapToolsDispatch()
  const { activeLabelID, activeSymbGroupID } = symbLabelState
  const { data, isFetching, error } = useQuery(
    CONFIG_QUERY_ID,
    () => asyncAwaitFetch<RawSheetsResponse>(configEndpoints.langConfig),
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [endoFonts, setEndoFonts] = useState<any[]>()

  const getLayout = (
    layout: AnyLayout,
    isInActiveGroup: boolean
  ): AnyLayout => {
    const bareMinimum: AnyLayout = {
      ...config.langLabelsStyle.layout,
      ...layout,
      visibility: isInActiveGroup ? 'visible' : 'none', // hide if inactive
    }

    if (!activeLabelID || activeLabelID === 'None' || !endoFonts) {
      return { ...bareMinimum, 'text-field': '' }
    }

    const isEndo = activeLabelID === 'Endonym'
    const defaultFont = ['Noto Sans Regular', 'Arial Unicode MS Regular']
    const defaultTextField: Expression = ['to-string', ['get', activeLabelID]]
    // TODO: check if 'Font Image Alt' is popuplated instead of using http
    const imgCheck: Expression = [
      'case',
      ['==', ['slice', ['get', 'Endonym'], 0, 4], 'http'],
      ['get', 'Language'],
      ['get', 'Endonym'],
    ]

    return {
      ...bareMinimum,
      'text-font': isEndo ? endoFonts : defaultFont,
      'text-field': isEndo ? imgCheck : defaultTextField,
    }
  }

  useEffect(() => {
    // TODO: check `status === 'loading'` instead?
    if (isFetching || !data?.values) return

    const dataAsJson = sheetsToJSON<LangConfig>(data.values)

    mapToolsDispatch({
      type: 'SET_LANG_CONFIG_VIA_SHEETS',
      payload: dataAsJson,
    })
    setEndoFonts(prepEndoFilters(dataAsJson))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  if (error) throw new Error('Something went wrong fetching Le Sheetz')

  return (
    <Source
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="ID"
      type="vector"
      url={`mapbox://${mbStyleTileConfig.tilesetId}`}
      id={mbStyleTileConfig.langSrcID}
    >
      {symbLayers.map((layer: Types.LayerPropsPlusMeta) => {
        let { paint, layout } = layer
        const isInActiveGroup = layer.group === activeSymbGroupID

        layout = getLayout(layout, isInActiveGroup)

        // TODO: change symbol size (???) for selected feat. Evidently cannot
        // set layout properties base on feature-state though, so maybe this:
        // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setlayoutproperty
        if (activeLabelID && activeLabelID !== 'None') {
          paint = { ...langLabelsStyle.paint, ...paint }
        }

        return (
          <Layer
            key={layer.id}
            {...layer}
            type="symbol" // R.I.P. circles
            source-layer={mbStyleTileConfig.layerId}
            layout={layout}
            paint={paint}
          />
        )
      })}
    </Source>
  )
}
