import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

import { useMapToolsState } from 'components/context'
import { PolygonLayerProps } from './types'
import { useZoomToBounds, usePolySelFeatSymb } from './hooks'
import { nonCensusPolygonConfig } from './config.non-census-poly'

// Handy remnant from Boundaries layers:
// filter={['in', ['id'], ['literal', recordIDs]]}

export const PolygonLayer: FC<PolygonLayerProps> = (props) => {
  const { map, beforeId, mapLoaded, configKey } = props
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: come on
  const layerConfig = nonCensusPolygonConfig[configKey]
  const { sourceID, sourceLayer, routePath, visContextKey } = layerConfig
  const { tableName, url, fillPaint, linePaint } = layerConfig

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const visible = useMapToolsState()[visContextKey]

  useZoomToBounds(routePath, tableName, mapLoaded, map)
  usePolySelFeatSymb({ map, mapLoaded, configKey })

  return (
    <Source
      id={sourceID}
      url={url}
      type="vector"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="name"
    >
      <Layer
        // TODO: rm if layer order is never important
        id={`${sourceID}-placeholder`}
        type="background"
        paint={{ 'background-opacity': 0 }}
      />
      <Layer
        id={`${sourceID}-poly`}
        source={sourceID}
        source-layer={sourceLayer}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paint={fillPaint}
        type="fill"
        beforeId={beforeId}
        layout={{ visibility: visible ? 'visible' : 'none' }}
      />
      <Layer
        id={`${sourceID}-line`}
        source={sourceID}
        source-layer={sourceLayer}
        paint={linePaint}
        type="line"
        beforeId={beforeId}
        layout={{ visibility: visible ? 'visible' : 'none' }}
      />
    </Source>
  )
}
