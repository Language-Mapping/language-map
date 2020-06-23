import React, { FC, useState } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'

import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { pointStyle } from './map-style'

export const Map: FC = () => {
  // Unsure why it needs the type here but not for feature coords...
  const nyc = [-73.96, 40.7128] as [number, number]
  const zoom = 10
  // TODO: restore when makes sense to
  // const bearing = -13
  // const pitch = 45
  const [viewport, setViewport] = useState({
    latitude: nyc[1],
    longitude: nyc[0],
    zoom,
    // TODO: restore when makes sense to
    // bearing,
    // pitch,
  })

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
