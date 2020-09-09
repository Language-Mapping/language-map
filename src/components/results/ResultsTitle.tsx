/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableTitleRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    titleIcon: {
      fontSize: '0.6em',
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1),
      flexShrink: 0,
    },
  })
)

export const ResultsTitle: FC = () => {
  const classes = useStyles()

  return (
    <Typography variant="h4" className={classes.tableTitleRoot}>
      <TiThList className={classes.titleIcon} />
      Data
    </Typography>
  )
}
