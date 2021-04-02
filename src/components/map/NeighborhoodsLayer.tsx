import React, { FC, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Source, Layer } from 'react-map-gl'

import { useMapToolsState } from 'components/context'
import { PolygonLayerProps } from './types'
import { useZoomToBounds } from './hooks'

const polygonsConfigNew = {
  neighborhoods: {
    linePaint: { 'line-color': 'orange', 'line-opacity': 0.4 },
    routePath: '/Explore/Neighborhood/:name',
    sourceID: 'neighborhoods',
    sourceLayer: 'neighborhoods',
    tableName: 'Neighborhood',
    url: 'mapbox://elalliance.ckmundquc1k5328ppob5a9wok-1kglp',
    visContextKey: 'showNeighbs',
    fillPaint: {
      'fill-color': 'orange',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        0.44,
        ['boolean', ['feature-state', 'hover'], false],
        0.29,
        0.14,
      ],
    },
  },
  counties: {
    linePaint: { 'line-color': '#9ebbd7', 'line-opacity': 0.4 },
    routePath: '/Explore/County/:name',
    sourceID: 'counties',
    sourceLayer: 'counties',
    tableName: 'County',
    url: 'mapbox://elalliance.ckmyz29pm0zzq22nax87m0kxb-7j7uy',
    visContextKey: 'showCounties',
    fillPaint: {
      'fill-color': 'hsl(193, 63%, 32%)',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        0.44,
        ['boolean', ['feature-state', 'hover'], false],
        0.29,
        0.14,
      ],
    },
  },
}

// Handy remnant from Boundaries layers:
// filter={['in', ['id'], ['literal', recordIDs]]}

export const PolygonLayer: FC<PolygonLayerProps> = (props) => {
  const { map, beforeId, mapLoaded, configKey } = props
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: come on
  const layerConfig = polygonsConfigNew[configKey]
  const { sourceID, sourceLayer, routePath, visContextKey } = layerConfig
  const { tableName, url, fillPaint, linePaint } = layerConfig
  const polyLayerID = `${sourceID}-poly` // TODO: de-fragilize

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const visible = useMapToolsState()[visContextKey]
  const match = useRouteMatch<{ name: string }>({
    path: routePath,
    // TODO: show at next level, e.g. /Explore/Neighborhood/Astoria/Something
    exact: true,
  })
  const valueParam = match?.params.name

  useZoomToBounds(routePath, tableName, mapLoaded, map)

  // Clear/set selected feature state
  useEffect(() => {
    if (!map || !mapLoaded || !map.getLayer(polyLayerID)) return

    map.removeFeatureState({ source: sourceID, sourceLayer }) // clear each time

    if (valueParam) {
      map.setFeatureState(
        {
          sourceLayer,
          source: sourceID,
          id: valueParam,
        },
        { selected: true }
      )
    }
    // Definitely need `mapLoaded`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, mapLoaded, match, valueParam, visible])

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
