import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Layer } from 'react-map-gl'
import { LinePaint, FillPaint, Expression } from 'mapbox-gl'

import { SelectedPolygonProps } from './types'
import { allPolyLayersConfig } from './config'
import { useZoomToBounds } from './hooks'

export const SelectedPolygon: FC<SelectedPolygonProps> = (props) => {
  const {
    map,
    beforeId,
    configKey,
    selLineColor,
    selFillColor,
    mapLoaded,
  } = props
  const { id } = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: come on
  const layerConfig = allPolyLayersConfig[configKey]
  const { sourceID, sourceLayer, routePath, uniqueIDfield } = layerConfig
  const { tableName, idIsNumeric } = layerConfig
  const uniqueID = idIsNumeric ? parseInt(id, 10) : id
  const filter: Expression = ['==', ['get', uniqueIDfield], uniqueID]

  useZoomToBounds(routePath, tableName, mapLoaded, map)

  const OutlinedFeature = (
    <Layer
      beforeId={beforeId}
      id={`${sourceID}-selected-line`}
      source={sourceID}
      source-layer={sourceLayer}
      type="line"
      filter={filter}
      paint={{ 'line-color': selLineColor, 'line-width': 2 } as LinePaint}
    />
  )

  if (!selFillColor) return OutlinedFeature

  return (
    <>
      <Layer
        beforeId={beforeId}
        id={`${sourceID}-selected-fill`}
        source={sourceID}
        source-layer={sourceLayer}
        type="fill"
        filter={filter}
        paint={
          { 'fill-opacity': 0.44, 'fill-color': selFillColor } as FillPaint
        }
      />
      {OutlinedFeature}
    </>
  )
}
