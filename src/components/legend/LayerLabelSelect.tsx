import React, { FC, useContext } from 'react'
import { TextField } from '@material-ui/core'

import { GlobalContext } from 'components'
import { commonSelectProps } from './config'
import { LangRecordSchema, LangSchemaCol } from '../../context/types'

export const LayerLabelSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const labelFields: LangSchemaCol[] = ['Language', 'Endonym']

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({
      type: 'SET_LANG_LAYER_LABELS',
      payload: event.target.value as keyof LangRecordSchema,
    })
  }

  return (
    <TextField
      {...commonSelectProps}
      label="Label communities by"
      value={state.activeLangLabelId}
      disabled={state.activeLangSymbGroupId === 'None'}
      onChange={handleChange}
      inputProps={{ name: 'label', id: 'lang-label-TextField' }}
    >
      <option value="None">No labels</option>
      {labelFields.map((label: string) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </TextField>
  )
}
