import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Checkbox } from '@material-ui/core'

import * as Types from './types'

const CHECK_STRING = 'http'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.secondary.main,
      marginLeft: 2, // shaaaaky
    },
  })
)

// CRED: (partial anyway):
// https://github.com/mbrn/material-table/issues/671#issuecomment-651743451
export const MediaColumnFilter: FC<Types.FilterComponentProps> = (props) => {
  const classes = useStyles()
  const { columnDef, onFilterChanged } = props
  const { tableData, field } = columnDef
  const { filterValue } = tableData
  const checked = filterValue === CHECK_STRING

  // REFACTOR: useMemo maybe? This gets run for EVERY record, and it's the same
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChanged(tableData.id, e.target.checked ? CHECK_STRING : '')
  }

  return (
    <FormControlLabel
      classes={{ root: classes.root }}
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          name={`set-${field?.replaceAll(' ', '-')}-filter`}
          size="small"
        />
      }
      label=""
    />
  )
}
