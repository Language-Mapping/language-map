import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/home/FiltersWarning'
import * as Types from './types'

export const usePanelRootStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
      padding: '1.25rem 0.75rem',
      [theme.breakpoints.up('sm')]: {
        padding: '1.75em 1.35em',
      },
    },
  })
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
    },
    introWrap: {
      marginBottom: '1rem',
      textAlign: 'center',
      borderBottom: `solid 1px ${theme.palette.divider}`,
      paddingBottom: '0.75rem',
    },
    introParagraph: {
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
    },
    titleAndIcon: {
      display: 'flex',
      fontSize: '2rem',
      lineHeight: 1.25,
      alignItems: 'center',
      textShadow: '1px 1px 3px hsla(0, 0%, 0%, 0.45)',
      justifyContent: 'center',
      '& svg': {
        color: theme.palette.text.secondary,
      },
      '& > :first-child': {
        marginRight: '0.5rem',
      },
    },
    // e.g. Endonym
    subtitle: {
      fontSize: '1.25rem',
      marginTop: 0,
      lineHeight: 1,
      color: theme.palette.text.secondary,
    },
    // e.g. glotto/iso/global speakers
    subSubtitle: {
      fontSize: '0.65rem',
      margin: '0.5rem 0 0.25rem',
      color: theme.palette.text.secondary,
    },
  })
)

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
// TODO: git mv into Panels.tsx
export const PanelContent: FC<Types.PanelContentProps> = (props) => {
  const { children, title, icon, subtitle } = props
  const { subSubtitle, extree, introParagraph } = props
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()

  const Intro = (
    <Typography className={classes.introWrap} component="header">
      <Typography component="h2" variant="h4" className={classes.titleAndIcon}>
        {icon}
        {title}
      </Typography>
      {subtitle && (
        <Typography className={classes.subtitle}>{subtitle}</Typography>
      )}
      {subSubtitle && <div className={classes.subSubtitle}>{subSubtitle}</div>}
      {introParagraph && (
        <Typography className={classes.introParagraph}>
          {introParagraph}
        </Typography>
      )}
      {extree}
    </Typography>
  )

  // TODO: ??? `id` in order to find unique element for `map.setPadding` ???
  return (
    <div className={`${panelRootClasses.root} ${classes.root}`}>
      {Intro}
      <FiltersWarning />
      <div>{children}</div>
    </div>
  )
}
