import React, { FC, useState, useEffect } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'

import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { dataLayer } from './map-style'

export const Map: FC = () => {
  // Unsure why it needs the type here but not for feature coords...
  const nyc = [-74.006, 40.7128] as [number, number]
  const zoom = 4
  // TODO: restore when makes sense to
  // const bearing = -13
  // const pitch = 45
  const [data, setData] = useState()
  const [viewport, setViewport] = useState({
    latitude: nyc[1],
    longitude: nyc[0],
    zoom,
    // TODO: restore when makes sense to
    // bearing,
    // pitch,
  })

  useEffect(() => {
    async function anyNameFunction() {
      const URL =
        'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
      const response = await fetch(URL)
      const geojson = await response.json()
      setData(geojson)
    }

    // Execute the created function directly
    anyNameFunction()
  }, [])

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={mapboxApiAccessToken}
    >
      {data && (
        <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
      )}
    </MapGL>
  )
}
