import React, { FC, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Source, Layer } from 'react-map-gl'

import { useMapToolsState } from 'components/context'
import { NeighborhoodsLayerProps, BoundsArray } from './types'
import { usePolygonWebMerc, useOffset } from './hooks'
import { getPolyWebMercView, flyToPoint } from './utils'

const minZoom = 8
const sourceID = 'neighborhoods-new'
const sourceLayer = 'neighborhoods'
const url = 'mapbox://elalliance.ckmundquc1k5328ppob5a9wok-1kglp'

const paint = {
  'fill-color': 'orange',
  'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    0.44,
    ['boolean', ['feature-state', 'hover'], false],
    0.29,
    0.14,
  ],
}

export const NeighborhoodsLayer: FC<NeighborhoodsLayerProps> = (props) => {
  const { map, beforeId, mapLoaded } = props
  const { showNeighbs } = useMapToolsState()
  const match = useRouteMatch<{ neighborhood: string }>({
    path: '/Explore/Neighborhood/:neighborhood',
    exact: true,
  })
  const neighborhood = match?.params.neighborhood
  const selPolyBounds = usePolygonWebMerc()
  const offset = useOffset()

  // Clear/set selected feature state
  useEffect(() => {
    if (!map || !mapLoaded || !map.getLayer('neighborhoods-poly')) return

    map.removeFeatureState({ source: sourceID, sourceLayer }) // clear each time

    if (neighborhood) {
      map.setFeatureState(
        {
          sourceLayer,
          source: sourceID,
          id: neighborhood,
        },
        { selected: true }
      )
    }
    // Definitely need `mapLoaded`
  }, [map, mapLoaded, match, neighborhood, showNeighbs])

  // Zoom to selected feature extent
  useEffect(() => {
    const { x_max: xMax, x_min: xMin, y_min: yMin, y_max: yMax } = selPolyBounds
    if (!map || !mapLoaded || !xMax || !xMin || !yMin || !yMax) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const boundsArray = [
      [xMin, yMin],
      [xMax, yMax],
    ] as BoundsArray

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const webMercViewport = getPolyWebMercView(boundsArray, offset)

    flyToPoint(map, { ...webMercViewport, offset })

    // LEGIT. selPolyBounds as a dep will break the world.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapLoaded,
    selPolyBounds.x_max,
    selPolyBounds.x_min,
    selPolyBounds.y_min,
    selPolyBounds.y_max,
    map,
  ])

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
        id="neighbs-placeholder"
        type="background"
        paint={{
          'background-opacity': 0,
        }}
      />
      <Layer
        id="neighborhoods-poly"
        source={sourceID}
        minzoom={minZoom}
        source-layer={sourceLayer}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paint={paint}
        type="fill"
        beforeId={beforeId}
        layout={{ visibility: showNeighbs ? 'visible' : 'none' }}
      />
      <Layer
        id="neighborhoods-line"
        source={sourceID}
        minzoom={minZoom}
        source-layer={sourceLayer}
        paint={{ 'line-color': 'orange', 'line-opacity': 0.4 }}
        type="line"
        beforeId={beforeId}
        layout={{ visibility: showNeighbs ? 'visible' : 'none' }}
      />
    </Source>
  )
}
