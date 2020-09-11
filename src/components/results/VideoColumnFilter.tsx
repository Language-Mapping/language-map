import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Checkbox } from '@material-ui/core'

import * as Types from './types'

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
  const [hasVideo, setHasVideo] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasVideo(e.target.checked)
    onFilterChanged(columnDef.tableData.id, e.target.checked ? 'http' : '')
  }

  return (
    <th>
      <FormControlLabel
        classes={{ root: classes.switchFormCtrlRoot }}
        control={
          <Checkbox
            checked={hasVideo}
            onChange={handleChange}
            name="set-video-filter"
            size="small"
          />
        }
        label=""
      />
    </th>
  )
}
