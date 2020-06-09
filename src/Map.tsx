import React, { FC } from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'

const MapboxMap = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiYWJldHRlcm1hcCIsImEiOiJjazVqengxMTgwOTB1M2pwbGNteHZkYTJrIn0.87lNhqvxIckDr8oZg_32Qg',
})

export const Map: FC = () => {
  return (
    <MapboxMap
      // eslint-ignore-next-line
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
        <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
      </Layer>
    </MapboxMap>
  )
}
