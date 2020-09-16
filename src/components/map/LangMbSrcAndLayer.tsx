import React, { FC, useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { AnyLayout } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import * as config from './config'

import { LayerPropsNonBGlayer, SheetsValues } from './types'
import { asyncAwaitFetch, prepEndoFilters } from './utils'

const { mbStyleTileConfig, langLabelsStyle, QUERY_ID, MB_FONTS_URL } = config

type SheetsResponse = { values: SheetsValues[] }

type SourceAndLayerComponent = {
  symbLayers: LayerPropsNonBGlayer[]
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
    if (!activeLangLabelId || activeLangLabelId === 'None' || !endoFonts) {
      return { ...layout, 'text-field': '' }
    }

    const isEndo = activeLangLabelId === 'Endonym'

    /* eslint-disable operator-linebreak */
    return {
      ...layout,
      visibility: isInActiveGroup ? 'visible' : 'none', // hide if inactive
      'text-font': isEndo
        ? endoFonts
        : ['Noto Sans Regular', 'Arial Unicode MS Regular'],
      'text-field': isEndo
        ? [
            'case',
            ['==', ['slice', ['get', 'Endonym'], 0, 4], 'http'],
            ['get', 'Language'],
            ['get', 'Endonym'],
          ]
        : ['to-string', ['get', activeLangLabelId]],
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
      {symbLayers.map((layer: LayerPropsNonBGlayer) => {
        let { paint, layout } = layer
        const isInActiveGroup =
          layer.metadata['mapbox:group'] === activeLangSymbGroupId

        layout = getLayout(layout, isInActiveGroup)

        // TODO: change symbol size (???) for selected feat. Evidently cannot
        // set layout properties base on feature-state though, so maybe this:
        // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setlayoutproperty
        if (activeLangLabelId && activeLangLabelId !== 'None') {
          paint = { ...paint, ...langLabelsStyle.paint }
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
