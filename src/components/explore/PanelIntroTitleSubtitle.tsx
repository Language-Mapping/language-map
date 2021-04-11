import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      textShadow: '1px 1px 4px hsla(0, 0%, 0%, 0.4)',
      fontSize: '2.25rem',
      marginBottom: '0.25rem',
      // Safari and/or Firefox seem to need smaller font than Chrome
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.25rem',
      },
      [theme.breakpoints.only('sm')]: {
        fontSize: '2.75rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2.5rem',
      },
      [theme.breakpoints.up('xl')]: {
        fontSize: '2.75rem',
      },
      '& img': {
        fontSize: '0.85em',
      },
      '& svg': {
        color: theme.palette.text.secondary, // for react-icons, not Swatch
      },
      '& > :first-child': {
        marginRight: '0.25rem',
      },
    },
    subTitle: {
      fontSize: '1.25rem',
      marginBottom: '0.25rem',
      lineHeight: 1,
      color: theme.palette.text.secondary,
      textAlign: 'center',
      '& + *': {
        marginBottom: '0.85rem',
      },
    },
  })
)

export const PanelIntroTitle: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <Typography variant="h3" className={classes.title}>
      {children}
    </Typography>
  )
}

export const PanelIntroSubtitle: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <Typography variant="h6" className={classes.subTitle}>
      {children}
    </Typography>
  )
}
