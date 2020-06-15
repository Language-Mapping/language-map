import React, { FC, useState, useEffect } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'

import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { polygonStyle, pointStyle } from './map-style'

export const Map: FC = () => {
  // Unsure why it needs the type here but not for feature coords...
  const nyc = [-73.96, 40.7128] as [number, number]
  const zoom = 10
  // TODO: restore when makes sense to
  // const bearing = -13
  // const pitch = 45
  const [polygonData, setPolygonData] = useState()
  const [pointData, setPointData] = useState()
  const [viewport, setViewport] = useState({
    latitude: nyc[1],
    longitude: nyc[0],
    zoom,
    // TODO: restore when makes sense to
    // bearing,
    // pitch,
  })

  useEffect(() => {
    async function getPolygons() {
      const URL = '/data/counties-nyc.geojson'
      const response = await fetch(URL)
      const geojson = await response.json()

      setPolygonData(geojson)
    }

    async function getPoints() {
      const URL =
        'https://gist.githubusercontent.com/abettermap/e6b901d3b12996cf593011b46000362f/raw/ela-nyc.geojson'
      const response = await fetch(URL)
      const geojson = await response.json()

      setPointData(geojson)
    }

    getPolygons()
    getPoints()
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
      {pointData && (
        <Source type="geojson" data={pointData}>
          {/* TODO: figure out why this doesn't work in TS. Looks like it wants 
          a string, which is the case after Mapbox does its thing with `paint.
          circle-color`, but until then it's an array. */}
          {/* @ts-ignore */}
          <Layer {...pointStyle} />
        </Source>
      )}
      {polygonData && (
        <Source type="geojson" data={polygonData}>
          <Layer {...polygonStyle} />
        </Source>
      )}
    </MapGL>
  )
}
