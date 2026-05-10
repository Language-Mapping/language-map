import React, { FC } from 'react'
import { GeolocateControl } from 'react-map-gl'

import { useMapToolsState } from 'components/context'

type GeolocationProps = {
  onGeolocate?: () => void
}

// v7 dropped onViewportChange; the GeolocateControl emits geolocate /
// trackuserlocationstart events instead. The Map's `onMove` handler keeps
// React state in sync with the underlying map view so we no longer need to
// manually push the geolocated viewport into state.
export const Geolocation: FC<GeolocationProps> = (props) => {
  const { onGeolocate } = props
  const { geolocActive } = useMapToolsState()

  return (
    <GeolocateControl
      positionOptions={{ enableHighAccuracy: true }}
      showUserLocation={geolocActive}
      style={{ display: 'none' }}
      trackUserLocation={geolocActive}
      onGeolocate={onGeolocate}
    />
  )
}
