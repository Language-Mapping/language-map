import React from 'react'
import { GridFilterInputValueProps, GridFilterOperator } from '@mui/x-data-grid'
import { FormControlLabel, Checkbox } from '@mui/material'

const CHECK_VALUE = 'http'

const MediaFilterInput: React.FC<GridFilterInputValueProps> = (props) => {
  const { item, applyValue } = props
  const checked = item.value === CHECK_VALUE

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyValue({ ...item, value: e.target.checked ? CHECK_VALUE : '' })
  }

  return (
    <FormControlLabel
      sx={{
        // Data Grid filter inputs sit on a baseline 18px above the bottom of
        // the filter row; an unlabeled checkbox renders too high without this.
        alignSelf: 'flex-end',
        marginBottom: '4px',
      }}
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          size="small"
          color="secondary"
        />
      }
      label="Has media"
    />
  )
}

// Single operator: "has URL" — value is truthy and contains "http"
export const mediaHasUrlOperator: GridFilterOperator = {
  label: 'has media',
  value: 'hasMedia',
  getApplyFilterFn: (filterItem) => {
    if (filterItem.value !== CHECK_VALUE) return null

    return ({ value }) => {
      if (!value) return false
      if (typeof value === 'string') return value.includes(CHECK_VALUE)
      if (Array.isArray(value)) {
        return value.some(
          (v) => typeof v === 'string' && v.includes(CHECK_VALUE)
        )
      }

      return false
    }
  },
  InputComponent: MediaFilterInput,
}
