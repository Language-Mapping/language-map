import React, { FC } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import * as Types from './types'
import { LocationSearchContent } from './LocationSearchContent'
import { useSpatialPanelStyles } from './styles'

export const GeolocToggle: FC<Types.GeolocationProps> = (props) => {
  const { setGeolocActive, geolocActive } = props
  const classes = useSpatialPanelStyles()

  return (
    <LocationSearchContent
      heading="Zoom to my location"
      explanation="Your location is not sent, shared, stored, or used for anything except zooming to your current location."
    >
      <FormControlLabel
        // onClick={(event) => event.stopPropagation()} // TODO: something
        classes={{
          label: classes.smallerText,
          root: classes.switchFormCtrlRoot,
        }}
        control={
          <Switch
            checked={geolocActive}
            onChange={() => setGeolocActive(!geolocActive)}
            name="toggle-geolocation"
            size="small"
          />
        }
        label="Show and zoom to my location"
      />
    </LocationSearchContent>
  )
}
