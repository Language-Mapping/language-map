import React, { FC } from 'react'
import { GeolocateControl } from 'react-map-gl'
import * as Types from './types'

type GeolocationProps = {
  active: boolean
  onViewportChange: (viewport: Types.ViewportState) => void
}

export const Geolocation: FC<GeolocationProps> = (props) => {
  const { active, onViewportChange } = props

  return (
    <GeolocateControl
      auto={active}
      onViewportChange={onViewportChange}
      positionOptions={{ enableHighAccuracy: true }}
      showUserLocation={active}
      style={{ display: 'none' }}
      trackUserLocation={active}
    />
  )
}
