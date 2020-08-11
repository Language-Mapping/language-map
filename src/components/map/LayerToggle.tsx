import React, { FC, useContext } from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'

import { GlobalContext } from 'components'
import { LayerVisibility } from 'context/types'

type LayerToggleComponent = {
  name: string
  layerId: keyof LayerVisibility
}

export const LayerToggle: FC<LayerToggleComponent> = ({ name, layerId }) => {
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
