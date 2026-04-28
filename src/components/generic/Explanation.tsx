import React, { FC, PropsWithChildren } from 'react'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'

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

export const Explanation: FC<PropsWithChildren<ExplanationProps>> = (props) => {
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
