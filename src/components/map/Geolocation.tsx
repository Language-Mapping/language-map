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
      trackUserLocation
      auto={active}
      style={{
        display: 'inline-block',
        position: 'absolute',
        bottom: 36,
        left: 8,
      }}
    />
  )
}
