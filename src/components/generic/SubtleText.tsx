import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.7em',
    },
  })
)

export const SubtleText: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <Typography component="div" className={classes.root}>
      {children}
    </Typography>
  )
}
