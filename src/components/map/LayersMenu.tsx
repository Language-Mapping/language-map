import React, { FC } from 'react'
import { FormControl, FormLabel, FormGroup } from '@material-ui/core'

import { LayerToggle } from 'components/map'

export const LayersMenu: FC = () => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Layer Toggles</FormLabel>
      <FormGroup>
        <LayerToggle layerId="languages" name="Languages" />
        <LayerToggle layerId="counties" name="Counties" />
        <LayerToggle layerId="neighborhoods" name="Neighborhoods" />
      </FormGroup>
    </FormControl>
  )
}
