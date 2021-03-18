import React, { FC } from 'react'
import { TextField } from '@material-ui/core'

import {
  useSymbAndLabelState,
  useLabelAndSymbDispatch,
} from 'components/context/SymbAndLabelContext'
import { InstanceLevelSchema } from 'components/context/types'
import { commonSelectProps } from './config'

// TODO: consider passing down some of the global stuff as props
export const LayerSymbSelect: FC = () => {
  const symbLabelState = useSymbAndLabelState()
  const symbLabelDispatch = useLabelAndSymbDispatch()
  const groupIDs = ['World Region', 'Size', 'Status'] // TODO: config file

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    symbLabelDispatch({
      type: 'SET_LANG_LAYER_SYMBOLOGY',
      payload: event.target.value as keyof InstanceLevelSchema,
    })
  }

  // TODO: these guys maybe? FormHelperText, NativeSelect
  return (
    <TextField
      {...commonSelectProps}
      label="Symbolize by"
      value={symbLabelState.activeSymbGroupID}
      onChange={handleChange}
      inputProps={{ name: 'symbology', id: 'lang-symb-select' }}
    >
      {groupIDs.map((id: string) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </TextField>
  )
}
