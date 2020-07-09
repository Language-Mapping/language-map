import React, { FC, useContext } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'

import { GlobalContext } from 'components'
import { LayerToggleType } from 'components/map'

export const LayerToggle: FC<LayerToggleType> = ({ name, layerId }) => {
  const { state, dispatch } = useContext(GlobalContext)
  const checked = state.layerVisibility[layerId]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layerId })
  }

  return (
    <FormControlLabel
      label={name}
      control={
        <Switch
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          checked={checked}
          onChange={handleChange}
          name={layerId}
        />
      }
    />
  )
}
