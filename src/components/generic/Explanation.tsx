import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      margin: '0.75rem 0 1rem',
    },
  })
)

export const Explanation: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <Typography component="p" className={classes.root} paragraph>
      {children}
    </Typography>
  )
}
