import React, { FC } from 'react'
import { TextField } from '@material-ui/core'

import {
  useSymbAndLabelState,
  useLabelAndSymbDispatch,
} from '../../context/SymbAndLabelContext'
import { commonSelectProps } from './config'
import { LangRecordSchema, LangSchemaCol } from '../../context/types'

export const LayerLabelSelect: FC = () => {
  const labelFields: LangSchemaCol[] = ['Language', 'Endonym']
  const symbLabelState = useSymbAndLabelState()
  const symbLabelDispatch = useLabelAndSymbDispatch()

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    symbLabelDispatch({
      type: 'SET_LANG_LAYER_LABELS',
      payload: event.target.value as keyof LangRecordSchema,
    })
  }

  return (
    <TextField
      {...commonSelectProps}
      label="Label by"
      value={symbLabelState.activeLabelID}
      disabled={symbLabelState.activeSymbGroupID === 'None'}
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
