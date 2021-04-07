import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

// Shaky but makes long endos like Church Slavonic's fit
type StyleProps = { tooLong?: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      textShadow: '1px 1px 4px hsla(0, 0%, 0%, 0.4)',
      fontSize: '2rem',
      marginBottom: '0.25rem',
      [theme.breakpoints.up('sm')]: {
        // Safari and/or Firefox seem to need smaller font than Chrome
        fontSize: '2.25rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '2.5rem',
      },
      '& img': {
        fontSize: '0.85em',
        // verticalAlign: -1, // Country flags look better?
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
      marginBottom: '0.5rem',
      lineHeight: 1,
      color: theme.palette.text.secondary,
      textAlign: 'center',
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
