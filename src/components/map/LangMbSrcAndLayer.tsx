import React, { FC, useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { CirclePaint, AnyLayout } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { LayerPropsNonBGlayer, SheetsValues } from './types'
import { mbStyleTileConfig } from './config'
import { asyncAwaitFetch, prepEndoFilters } from './utils'

// Ongoing fonts to check
// Tokpe Gola

type SheetsResponse = { values: SheetsValues[] }

type SourceAndLayerComponent = {
  symbLayers: LayerPropsNonBGlayer[]
  labelLayers: LayerPropsNonBGlayer[]
  activeLangSymbGroupId: string
  activeLangLabelId: string
}

// const ROSS_SHEET_ID =
//   '2PACX-1vTZB96D_w7Y4LsCBTb4zAa_25Nl44--Vb1dKA4AzstOwOZ7bsFQ5SvbjCHxzyqAbZf1hNCEiDgLwaS9'
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const QUERY_ID = 'sheets-mb-fonts' // unique react-query ID
const SHEET_ID = '1r94KUrO5Mq9BhFy3uMlgysK_at16L4Vb5hU0-4EX-TA'
const SHEET_NAME = 'Mapbox_Fonts'
const SHEETS_API_ROOT = 'https://sheets.googleapis.com/v4/spreadsheets'

const MB_FONTS_URL = `${SHEETS_API_ROOT}/${SHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_API_KEY}`

const commonCirclePaint = {
  'circle-stroke-color': 'cyan',
  'circle-stroke-width': [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    3,
    0,
  ],
} as CirclePaint

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const LangMbSrcAndLayer: FC<SourceAndLayerComponent> = ({
  symbLayers,
  labelLayers,
  activeLangSymbGroupId,
  activeLangLabelId,
}) => {
  const { data, isFetching, error } = useQuery(QUERY_ID)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fonts, setFonts] = useState<any[]>()

  useEffect(() => {
    queryCache.prefetchQuery(QUERY_ID, () => asyncAwaitFetch(MB_FONTS_URL))
  }, [])

  useEffect(() => {
    if (isFetching) return

    const { values: sheetsResponse } = data as SheetsResponse

    if (!sheetsResponse) return

    setFonts(prepEndoFilters(sheetsResponse))

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
      // YO: careful here, it's overriding what's in the MB style JSON...
      url={`mapbox://${mbStyleTileConfig.tilesetId}`}
      id={mbStyleTileConfig.langSrcID}
    >
      {symbLayers.map((layer: LayerPropsNonBGlayer) => {
        let { paint, layout } = layer
        const isInActiveGroup =
          layer.metadata['mapbox:group'] === activeLangSymbGroupId

        // Hide if not in active symbology group
        layout = {
          ...layout,
          visibility: isInActiveGroup ? 'visible' : 'none',
        }

        // Set selected feature stroke for all layers of `circle` type
        if (layer.type === 'circle') {
          paint = { ...paint, ...commonCirclePaint }
        } else if (layer.type === 'symbol') {
          // TODO: change symbol size (???) for selected feat. Evidently cannot
          // set layout properties base on feature-state though, so maybe this:
          // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setlayoutproperty
          // 0.5 good with 24x24 SVG if there is a background circle. Otherwise
          // a little smaller is better.
          layout = { ...layout, 'icon-size': 0.4 }
        }

        return (
          // TODO: some kind of transition/animation on switch
          <Layer
            key={layer.id}
            {...layer}
            // YO: careful here, it's overriding what's in the MB style JSON...
            source-layer={mbStyleTileConfig.layerId}
            layout={layout}
            paint={paint}
          />
        )
      })}
      {/* TODO: set "text-size" value based on zoom level */}
      {/* TODO: make expressions less redundant, AND make it config-driven so
      that the font stuff is not so tangled up in the MB config (totally
      separate file may be best) */}
      {labelLayers.map((layer: LayerPropsNonBGlayer) => {
        const isActiveLabel = layer.id === activeLangLabelId
        const isEndonym = layer.id === 'Endonym'

        const layout: AnyLayout = {
          ...layer.layout,
          visibility: isActiveLabel ? 'visible' : 'none',
        }

        /* eslint-disable @typescript-eslint/ban-ts-comment */
        if (isEndonym && fonts) {
          // @ts-ignore
          layout['text-font'] = [
            'let',
            'lang',
            ['get', 'Language'],
            // @ts-ignore
            ['case', ...fonts],
          ]
        }
        /* eslint-enable @typescript-eslint/ban-ts-comment */

        return (
          <Layer
            key={layer.id}
            {...layer}
            // YO: careful here, it's overriding what's in the MB style JSON...
            source-layer={mbStyleTileConfig.layerId}
            layout={layout}
          />
        )
      })}
    </Source>
  )
}
