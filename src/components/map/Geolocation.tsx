import React, { FC } from 'react'
import { GeolocateControl } from 'react-map-gl'

import { useMapToolsState } from 'components/context'
import * as Types from './types'

type GeolocationProps = {
  onViewportChange: (viewport: Types.ViewportState) => void
}

export const Geolocation: FC<GeolocationProps> = (props) => {
  const { onViewportChange } = props
  const { geolocActive } = useMapToolsState()

  return (
    <GeolocateControl
      auto={geolocActive}
      onViewportChange={onViewportChange}
      positionOptions={{ enableHighAccuracy: true }}
      showUserLocation={geolocActive}
      style={{ display: 'none' }}
      trackUserLocation={geolocActive}
    />
  )
}
