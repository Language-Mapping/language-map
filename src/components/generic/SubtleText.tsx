import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.65rem',
      marginBottom: '0.5rem',
    },
  })
)

export const SubtleText: FC<{ className?: string }> = (props) => {
  const { children, className = '' } = props
  const classes = useStyles()

  return (
    <Typography component="div" className={`${classes.root} ${className}`}>
      {children}
    </Typography>
  )
}
