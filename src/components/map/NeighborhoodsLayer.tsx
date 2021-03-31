import React, { FC, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Source, Layer } from 'react-map-gl'

import { useMapToolsState } from 'components/context'
import { NeighborhoodsLayerProps } from './types'

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
  const { map } = props
  const { showNeighbs } = useMapToolsState()
  const match = useRouteMatch<{ neighborhood: string }>({
    path: '/Explore/Neighborhood/:neighborhood',
    exact: true,
  })
  const neighborhood = match?.params.neighborhood

  useEffect(() => {
    if (!map || !neighborhood) return

    map.setFeatureState(
      {
        sourceLayer,
        source: sourceID,
        id: neighborhood,
      },
      { selected: true }
    )
  }, [map, match, neighborhood])

  // elalliance.ckmundquc1k5328ppob5a9wok-1kglp
  // if (!visible) return null
  // if (!showNeighbs) return null

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
      {showNeighbs ? (
        <Layer
          id="neighborhoods-poly"
          minzoom={minZoom}
          source-layer={sourceLayer}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          paint={paint}
          type="fill"
        />
      ) : (
        <></>
      )}
    </Source>
  )
}
