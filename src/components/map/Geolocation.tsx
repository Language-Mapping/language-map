import React, { FC } from 'react'
import { GeolocateControl } from 'react-map-gl'

type GeolocationProps = {
  active: boolean
}

export const Geolocation: FC<GeolocationProps> = (props) => {
  const { active } = props

  return (
    <GeolocateControl
      positionOptions={{ enableHighAccuracy: true }}
      trackUserLocation={active}
      showUserLocation={active}
      auto={active}
      style={{ display: 'none' }}
    />
  )
}
