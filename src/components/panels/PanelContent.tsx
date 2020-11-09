import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/filters/FiltersWarning'
import * as Types from './types'

export const usePanelRootStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
      padding: '1.25em 1em',
      [theme.breakpoints.up('sm')]: {
        padding: '1.5em 1.25em',
      },
    },
  })
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
    },
    title: {
      fontSize: '2em',
      marginBottom: '0.75em',
      textAlign: 'center',
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.4em',
      },
      '& > :not(:first-child)': {
        marginTop: '0.25em',
      },
      '& svg': {
        fontSize: '0.75em',
        fill: theme.palette.text.secondary,
      },
    },
    titleAndIcon: {
      display: 'flex',
      lineHeight: 1.25,
      alignItems: 'center',
      textShadow: '1px 1px 3px hsla(0, 0%, 0%, 0.45)',
      justifyContent: 'center',
      '& > :first-child': {
        marginRight: '0.25em',
      },
    },
    // e.g. Endonym
    subtitle: {
      fontSize: '0.5em',
      color: theme.palette.text.secondary,
    },
    subSubtitle: {
      fontSize: '0.3em',
      color: theme.palette.text.secondary,
      fontFamily: theme.typography.body1.fontFamily,
    },
    header: {
      marginBottom: '0.75em',
    },
    intro: {
      borderBottom: `solid 1px ${theme.palette.divider}`,
      color: theme.palette.text.secondary,
      fontSize: '0.65rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '0.25em',
      maxWidth: '85%',
      paddingBottom: '0.75em',
    },
  })
)

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
// TODO: git mv into Panels.tsx
export const PanelContent: FC<Types.PanelContentProps> = (props) => {
  const { children, title, intro, icon, subtitle, subSubtitle } = props
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()

  // TODO: reconsider this logic. Could get confusing if wanting to show it
  // regardless of title redundancy.
  const Subtitle =
    subtitle && subtitle !== title ? (
      <Typography className={classes.subtitle}>{subtitle}</Typography>
    ) : null

  const Title = (
    <Typography className={classes.title} component="header">
      <Typography component="h2" variant="h4" className={classes.titleAndIcon}>
        {icon}
        {title}
      </Typography>
      {Subtitle}
      <div className={classes.subSubtitle}>{subSubtitle}</div>
      <Typography className={classes.intro}>{intro}</Typography>
    </Typography>
  )

  // TODO: ??? `id` in order to find unique element for `map.setPadding` ???
  return (
    <div className={`${panelRootClasses.root} ${classes.root}`}>
      {Title}
      <FiltersWarning />
      <div>{children}</div>
    </div>
  )
}
