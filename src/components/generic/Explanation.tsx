import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
    },
  })
)

type ExplanationProps = {
  component?: 'div' | 'p'
  className?: string
}

export const Explanation: FC<ExplanationProps> = (props) => {
  const { children, component = 'p', className = '' } = props
  const classes = useStyles()

  return (
    <Typography
      component={component}
      className={`${classes.root} ${className}`}
    >
      {children}
    </Typography>
  )
}
