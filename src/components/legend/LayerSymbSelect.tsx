import React, { FC, useContext } from 'react'
import { TextField } from '@material-ui/core'

import { GlobalContext } from 'components'
import { commonSelectProps } from './config'
import { LangRecordSchema } from '../../context/types'

// TODO: consider passing down some of the global stuff as props
export const LayerSymbSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const groupIDs = ['World Region', 'Size', 'Status'] // TODO: config file?

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({
      type: 'SET_LANG_LAYER_SYMBOLOGY',
      payload: event.target.value as keyof LangRecordSchema,
    })
  }

  // TODO: these guys maybe? FormHelperText, NativeSelect
  return (
    <TextField
      {...commonSelectProps}
      label="Show communities by"
      value={state.activeLangSymbGroupId}
      onChange={handleChange}
      inputProps={{ name: 'symbology', id: 'lang-symb-select' }}
    >
      <option value="None">None (hide layer)</option>
      {groupIDs.map((id: string) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </TextField>
  )
}
