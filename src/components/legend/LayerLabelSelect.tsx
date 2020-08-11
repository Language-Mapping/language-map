import React, { FC, useContext } from 'react'
import { TextField } from '@material-ui/core'

import { GlobalContext } from 'components'
import { commonSelectProps } from './config'

export const LayerLabelSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({
      type: 'SET_LANG_LAYER_LABELS',
      payload: event.target.value as string,
    })
  }

  return (
    <TextField
      {...commonSelectProps}
      label="Label by:"
      value={state.activeLangLabelId}
      onChange={handleChange}
      inputProps={{ name: 'label', id: 'lang-label-TextField' }}
    >
      <option value="None">No labels</option>
      {state.langLabels.map((label: string) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </TextField>
  )
}
