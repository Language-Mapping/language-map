import React, { FC, useContext } from 'react'
import { FormControl, InputLabel, Select } from '@material-ui/core'

import { GlobalContext } from 'components'

export const LayerLabelSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const currentValue = state.activeLangLabelKey

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ type: 'SET_LANG_LABELS', payload: event.target.value })
  }

  return (
    <FormControl>
      <InputLabel htmlFor="lang-label-select">Label by:</InputLabel>
      <Select
        native
        value={currentValue}
        onChange={handleChange}
        inputProps={{
          name: 'label',
          id: 'lang-label-select',
        }}
      >
        <option value="Neighborhood">Neighborhood</option>
        <option value="Endonym">Endonym</option>
        <option value="Glottocode">Glottocode</option>
      </Select>
    </FormControl>
  )
}
