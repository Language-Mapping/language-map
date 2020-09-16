import React, { FC, useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { CirclePaint, AnyLayout } from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { LayerPropsNonBGlayer, SheetsValues } from './types'
import { mbStyleTileConfig, langLabelsStyle } from './config'
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

// TODO: rm when ready
// const SHEET_ID = '1r94KUrO5Mq9BhFy3uMlgysK_at16L4Vb5hU0-4EX-TA' // mine
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const QUERY_ID = 'sheets-mb-fonts' // unique react-query ID
const SHEET_ID = '1QfySFNpD2VnLand3-lTNAPAlrm0Cmv9As01LAXgXC0E'
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
  const [endoFonts, setEndoFonts] = useState<any[]>()

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

          if (activeLangLabelId && activeLangLabelId !== 'None') {
            paint = { ...paint, ...langLabelsStyle.paint }
            layout = { ...layout, ...langLabelsStyle.layout }

            if (endoFonts && activeLangLabelId === 'Endonym') {
              layout = {
                ...layout,
                'text-font': endoFonts,
                'text-field': [
                  'case',
                  ['==', ['slice', ['get', 'Endonym'], 0, 4], 'http'],
                  ['get', 'Language'],
                  ['get', 'Endonym'],
                ],
              }
            }
          } else {
            layout = { ...layout, 'text-field': '' }
          }
        }

        return (
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
      {/* TODO: make expressions less redundant */}
      {labelLayers.map((layer: LayerPropsNonBGlayer) => {
        const isActiveLabel = layer.id === activeLangLabelId
        const isStatusSymbol = activeLangSymbGroupId === 'Status' // FRAGILE

        let layout: AnyLayout = {
          ...layer.layout,
          visibility: isActiveLabel && !isStatusSymbol ? 'visible' : 'none',
        }

        if (layer.id === 'Endonym' && endoFonts) {
          layout = { ...layout, 'text-font': endoFonts }
        }

        return (
          <Layer
            key={layer.id}
            {...layer}
            // YO: careful here, it's overriding what's in the MB style JSON...
            source-layer={mbStyleTileConfig.layerId}
            layout={layout}
            paint={{ ...layer.paint, ...langLabelsStyle.paint }}
          />
        )
      })}
    </Source>
  )
}
