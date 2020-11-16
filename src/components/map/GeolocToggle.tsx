import React, { FC } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'
import { LocationSearchContent } from './LocationSearchContent'
import { useSpatialPanelStyles } from './styles'

export const GeolocToggle: FC = () => {
  const { geolocActive } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  const classes = useSpatialPanelStyles()

  const handleChange = () => {
    mapToolsDispatch({
      type: 'SET_GEOLOC_ACTIVE',
      payload: !geolocActive,
    })
  }

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
            onChange={handleChange}
            name="toggle-geolocation"
            size="small"
          />
        }
        label="Show and zoom to my location"
      />
    </LocationSearchContent>
  )
}
