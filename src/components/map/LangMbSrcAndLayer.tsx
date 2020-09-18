import React, { FC, useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { AnyLayout, Expression } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import * as config from './config'

import { LayerPropsPlusMeta, SheetsValues } from './types'
import { asyncAwaitFetch, prepEndoFilters } from './utils'

const { mbStyleTileConfig, langLabelsStyle, QUERY_ID, MB_FONTS_URL } = config

type SheetsResponse = { values: SheetsValues[] }

type SourceAndLayerComponent = {
  symbLayers: LayerPropsPlusMeta[]
  activeLangSymbGroupId: string
  activeLangLabelId: string
}

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const LangMbSrcAndLayer: FC<SourceAndLayerComponent> = ({
  symbLayers,
  activeLangSymbGroupId,
  activeLangLabelId,
}) => {
  const { data, isFetching, error } = useQuery(QUERY_ID)
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

    if (!activeLangLabelId || activeLangLabelId === 'None' || !endoFonts) {
      return { ...bareMinimum, 'text-field': '' }
    }

    const isEndo = activeLangLabelId === 'Endonym'
    const defaultFont = ['Noto Sans Regular', 'Arial Unicode MS Regular']
    const defaultTextField: Expression = [
      'to-string',
      ['get', activeLangLabelId],
    ]
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
    // TODO: maybe not prefetch?
    queryCache.prefetchQuery(QUERY_ID, () => asyncAwaitFetch(MB_FONTS_URL))
  }, [])

  useEffect(() => {
    if (isFetching) return

    const { values: sheetsResponse } = data as SheetsResponse

    if (!sheetsResponse) return

    setEndoFonts(prepEndoFilters(sheetsResponse))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  // TODO: Sentry
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
      {symbLayers.map((layer: LayerPropsPlusMeta) => {
        let { paint, layout } = layer
        const isInActiveGroup = layer.group === activeLangSymbGroupId

        layout = getLayout(layout, isInActiveGroup)

        // TODO: change symbol size (???) for selected feat. Evidently cannot
        // set layout properties base on feature-state though, so maybe this:
        // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setlayoutproperty
        if (activeLangLabelId && activeLangLabelId !== 'None') {
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
      {/* TODO: set "text-size" value based on zoom level */}
      {/* TODO: make expressions less redundant */}
    </Source>
  )
}
