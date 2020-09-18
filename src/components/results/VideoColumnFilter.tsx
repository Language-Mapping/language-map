import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Checkbox } from '@material-ui/core'

import * as Types from './types'

const CHECK_STRING = 'http'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    switchFormCtrlRoot: {
      color: theme.palette.secondary.main,
      marginLeft: 2, // shaaaaky
    },
  })
)

// CRED: (partial anyway):
// https://github.com/mbrn/material-table/issues/671#issuecomment-651743451
export const VideoColumnFilter: FC<Types.FilterComponentProps> = (props) => {
  const classes = useStyles()
  const { columnDef, onFilterChanged } = props
  const { tableData } = columnDef
  const { filterValue } = tableData
  const checked = filterValue === CHECK_STRING

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChanged(tableData.id, e.target.checked ? CHECK_STRING : '')
  }

  return (
    <FormControlLabel
      classes={{ root: classes.switchFormCtrlRoot }}
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          name="set-video-filter"
          size="small"
        />
      }
      label=""
    />
  )
}
