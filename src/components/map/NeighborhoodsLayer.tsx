import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

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

export const NeighborhoodsLayer: FC = () => {
  // const { beforeId, visible } = props

  // elalliance.ckmundquc1k5328ppob5a9wok-1kglp
  // if (!visible) return null

  return (
    <Source id={sourceID} url={url} type="vector">
      <Layer
        id="neighbs-placeholder"
        type="background"
        paint={{
          'background-opacity': 0,
        }}
      />
      {/* ...then use its id as the 'beforeId' for other layers. Boom. */}
      <Layer
        // beforeId={beforeId}
        id="neighborhoods-poly"
        minzoom={minZoom}
        source-layer={sourceLayer}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paint={paint}
        type="fill"
      />
      {/* <Layer beforeId={beforeId} {...layer} layout={{ ...layer.layout }} /> */}
    </Source>
  )
}