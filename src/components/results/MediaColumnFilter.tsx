import React from 'react'
import { GridFilterInputValueProps, GridFilterOperator } from '@mui/x-data-grid'
import { FormControlLabel, Checkbox } from '@mui/material'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

const CHECK_VALUE = 'http'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.secondary.main,
      marginLeft: 2,
    },
  })
)

const MediaFilterInput: React.FC<GridFilterInputValueProps> = (props) => {
  const { item, applyValue } = props
  const classes = useStyles()
  const checked = item.value === CHECK_VALUE

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyValue({ ...item, value: e.target.checked ? CHECK_VALUE : '' })
  }

  return (
    <FormControlLabel
      classes={{ root: classes.root }}
      control={
        <Checkbox checked={checked} onChange={handleChange} size="small" />
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
