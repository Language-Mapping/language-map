import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      marginTop: '0.75rem',
    },
  })
)

export const Explanation: FC<{ component?: 'div' | 'p' }> = (props) => {
  const { children, component = 'p' } = props
  const classes = useStyles()

  return (
    <Typography component={component} className={classes.root} paragraph>
      {children}
    </Typography>
  )
}
