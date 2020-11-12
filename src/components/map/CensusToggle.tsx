import React, { FC } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'

import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import * as Types from './types'
import { LocationSearchContent } from './LocationSearchContent'
import { useSpatialPanelStyles } from './styles'

export const CensusToggle: FC<Types.CensusToggleProps> = (props) => {
  const { setCensusVisible, censusVisible } = props
  const classes = useSpatialPanelStyles()

  return (
    <LocationSearchContent
      heading="Census Shtuff"
      explanation="Let's get that tract ball rolling"
    >
      <FormControlLabel
        classes={{
          label: classes.smallerText,
          root: classes.switchFormCtrlRoot,
        }}
        control={
          <Switch
            checked={censusVisible}
            onChange={() => setCensusVisible(!censusVisible)}
            name="toggle-census"
            size="small"
          />
        }
        label="Show census tracts"
      />
    </LocationSearchContent>
  )
}
