import React, { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { AnyLayout, Expression } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { useSymbAndLabelState } from 'components/context/SymbAndLabelContext'
import { asyncAwaitFetch, prepEndoFilters } from './utils'

import * as config from './config'
import * as Types from './types'

const { mbStyleTileConfig, langLabelsStyle, QUERY_ID, MB_FONTS_URL } = config

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const LangMbSrcAndLayer: FC<Types.LangMbSrcAndLayerProps> = ({
  symbLayers,
}) => {
  const symbLabelState = useSymbAndLabelState()
  const { activeLabelID, activeSymbGroupID } = symbLabelState
  const { data, isFetching, error } = useQuery(QUERY_ID, () =>
    asyncAwaitFetch<Types.SheetsResponse>(MB_FONTS_URL)
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

    /* eslint-disable operator-linebreak */
    return {
      ...bareMinimum,
      'text-font': isEndo ? endoFonts : defaultFont,
      'text-field': isEndo ? imgCheck : defaultTextField,
    }
    /* eslint-enable operator-linebreak */
  }

  useEffect(() => {
    if (isFetching || !data?.values) return

    setEndoFonts(prepEndoFilters(data.values))
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
