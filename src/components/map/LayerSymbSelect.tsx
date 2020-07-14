import React, { FC, useContext } from 'react'
import { FormControl, InputLabel, Select } from '@material-ui/core'

import { GlobalContext } from 'components'

export const LayerSymbSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const { langSymbGroups, activeLangSymbGroupId } = state
  const groupIDs = Object.keys(langSymbGroups)

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ type: 'SET_LANG_LAYER_SYMBOLOGY', payload: event.target.value })
  }

  // TODO: these guys?
  // FormHelperText,
  // NativeSelect,
  return (
    <FormControl>
      <InputLabel htmlFor="lang-symb-select">Show by:</InputLabel>
      <Select
        native
        value={activeLangSymbGroupId}
        onChange={handleChange}
        inputProps={{
          name: 'symbology',
          id: 'lang-symb-select',
        }}
      >
        {groupIDs.map((id: string) => (
          <option key={id} value={id}>
            {langSymbGroups[id].name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}
