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
      const URL =
        'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
      const response = await fetch(URL)
      const geojson = await response.json()

      setPolygonData(geojson)
    }

    async function getPoints() {
      const URL =
        'https://services2.arcgis.com/NlsizNmbMFiinWw4/ArcGIS/rest/services/Languages_of_New_York_test/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token='
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
