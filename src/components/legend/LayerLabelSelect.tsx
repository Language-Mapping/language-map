import React, { FC } from 'react'
import { TextField } from '@material-ui/core'

import {
  useSymbAndLabelState,
  useLabelAndSymbDispatch,
} from 'components/context/SymbAndLabelContext'
import { InstanceLevelSchema, LangSchemaCol } from 'components/context/types'
import { commonSelectProps } from './config'

export const LayerLabelSelect: FC = () => {
  const labelFields: LangSchemaCol[] = ['Language', 'Endonym']
  const symbLabelState = useSymbAndLabelState()
  const symbLabelDispatch = useLabelAndSymbDispatch()

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // Always show on change, confusing otherwise
    symbLabelDispatch({ type: 'TOGGLE_LANG_LABELS', payload: false })

    symbLabelDispatch({
      type: 'SET_LANG_LAYER_LABELS',
      payload: event.target.value as keyof InstanceLevelSchema,
    })
  }

  return (
    <TextField
      {...commonSelectProps}
      label="Label by"
      value={symbLabelState.activeLabelID}
      onChange={handleChange}
      inputProps={{ name: 'label', id: 'lang-label-TextField' }}
    >
      {labelFields.map((label: string) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </TextField>
  )
}
