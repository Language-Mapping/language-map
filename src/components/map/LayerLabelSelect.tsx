import React, { FC, useContext } from 'react'
import { FormControl, InputLabel, Select } from '@material-ui/core'

import { GlobalContext } from 'components'

export const LayerLabelSelect: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const { activeLangLabelId, langLabels } = state

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({
      type: 'SET_LANG_LAYER_LABELS',
      payload: event.target.value as string,
    })
  }

  return (
    <FormControl>
      <InputLabel htmlFor="lang-label-select">Label by:</InputLabel>
      <Select
        native
        value={activeLangLabelId}
        onChange={handleChange}
        inputProps={{
          name: 'label',
          id: 'lang-label-select',
        }}
      >
        <option value="None">No labels</option>
        {langLabels.map((label: string) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}
