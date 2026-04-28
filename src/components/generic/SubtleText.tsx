import React, { FC, PropsWithChildren } from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { Typography } from '@mui/material'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      fontSize: '0.65rem',
      marginBottom: '0.5rem',
    },
  })
)

export const SubtleText: FC<PropsWithChildren<{ className?: string }>> = (
  props
) => {
  const { children, className = '' } = props
  const classes = useStyles()

  return (
    <Typography component="div" className={`${classes.root} ${className}`}>
      {children}
    </Typography>
  )
}
