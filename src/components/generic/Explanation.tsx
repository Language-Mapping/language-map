import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      marginTop: 0,
      marginBottom: '0.5rem',
      [theme.breakpoints.only('sm')]: {
        fontSize: '0.85rem',
      },
    },
  })
)

type ExplanationProps = {
  component?: 'div' | 'p'
  className?: string
}

export const Explanation: FC<ExplanationProps> = (props) => {
  const { children, component = 'div', className = '' } = props
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
