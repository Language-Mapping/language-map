import React, { FC, useState } from 'react'
import MapGL from 'react-map-gl'

export const Map: FC = () => {
  // Unsure why it needs the type here but not for feature coords...
  const hood = [-74.006, 40.7128] as [number, number]
  const zoom = 13
  const bearing = -13
  const pitch = 45
  const [viewport, setViewport] = useState({
    latitude: hood[1],
    longitude: hood[0],
    zoom,
    bearing,
    pitch,
  })

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
    />
  )
}
