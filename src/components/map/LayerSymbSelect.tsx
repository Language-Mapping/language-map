import React, { FC, useContext } from 'react'
import { FormControl, InputLabel, Select } from '@material-ui/core'

import { GlobalContext } from 'components'

export const LayerSymbSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const currentValue = state.activeLangSymbKey

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ type: 'SET_LANG_SYMBOLOGY', payload: event.target.value })
  }

  // TODO: these guys?
  // FormHelperText,
  // NativeSelect,
  return (
    <FormControl>
      <InputLabel htmlFor="lang-symb-select">Show by:</InputLabel>
      <Select
        native
        value={currentValue}
        onChange={handleChange}
        inputProps={{
          name: 'symbology',
          id: 'lang-symb-select',
        }}
      >
        {state.langSymbOptions.map((name: string) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}
