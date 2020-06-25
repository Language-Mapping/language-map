import React, { FC, useState } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'

import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { pointStyle } from './map-style'

type InitialMapState = {
  latitude: number
  longitude: number
  zoom: number
}

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const [viewport, setViewport] = useState({ latitude, longitude, zoom })

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={mapboxApiAccessToken}
    >
      <Source type="vector" url="mapbox://abettermap.4xoc92wx">
        {/* TODO: figure out why this doesn't work in TS. Looks like it wants 
          a string, which is the case after Mapbox does its thing with `paint.
          circle-color`, but until then it's an array. */}
        {/* @ts-ignore */}
        <Layer {...pointStyle} />
      </Source>
    </MapGL>
  )
}
