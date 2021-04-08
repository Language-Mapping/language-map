import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Layer } from 'react-map-gl'
import { LinePaint, Expression } from 'mapbox-gl'

import { CensusLayerProps } from './types'
import { censusLayersConfig } from './config.census'
import { useZoomToBounds } from './hooks'

export const SelectedCensusPolygon: FC<
  CensusLayerProps & { lineColor: string }
> = (props) => {
  const { map, beforeId, configKey, mapLoaded, lineColor } = props
  const { id } = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: come on
  const layerConfig = censusLayersConfig[configKey]
  const { sourceID, sourceLayer, routePath } = layerConfig
  const { tableName } = layerConfig
  const GEOID = parseInt(id, 10)
  const filter: Expression = ['case', ['==', ['get', 'GEOID'], GEOID]]

  useZoomToBounds(routePath, tableName, mapLoaded, map)

  return (
    <Layer
      beforeId={beforeId}
      id={`${sourceID}-selected-line`}
      source={sourceID}
      source-layer={sourceLayer}
      type="line"
      paint={
        {
          'line-color': [...filter, lineColor, 'transparent'] as Expression,
          'line-width': [...filter, 2, 1] as Expression,
        } as LinePaint
      }
    />
  )
}
