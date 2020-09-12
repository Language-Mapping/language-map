import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { GoInfo } from 'react-icons/go'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filtersWarning: {
      display: 'flex', // TODO: probably not flex, only need for icon vert align
      alignItems: 'center',
      fontSize: '0.8em',
      color: theme.palette.text.secondary,
      '& > svg': { marginRight: '0.4em' },
    },
  })
)

// Let user know that they are searching filtered data
export const FiltersWarning: FC = () => {
  const classes = useStyles()

  return (
    <Typography className={classes.filtersWarning}>
      <GoInfo />
      Any filters in the Data Table will be applied.
    </Typography>
  )
}
