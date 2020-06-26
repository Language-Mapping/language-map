import React, { FC, useState } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { pointStyle } from './map-style'
import { InitialMapState } from './types'

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
      {/* TODO: put in config, separate component, something */}
      <Source
        type="vector"
        url="mapbox://rhododendron.2knla7ts"
        id="languages-src"
      >
        {/* TODO: figure out why this doesn't work in TS. Looks like it wants 
          a string, which is the case after Mapbox does its thing with `paint.
          circle-color`, but until then it's an array. */}
        {/* @ts-ignore */}
        <Layer {...pointStyle} />
      </Source>
    </MapGL>
  )
}
