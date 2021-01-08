import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/home/FiltersWarning'
import { PanelContentProps } from './types'
import { MOBILE_PANEL_HEADER_HT } from './config'

export const usePanelRootStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      bottom: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '1.25rem 0.8rem',
      position: 'absolute',
      top: MOBILE_PANEL_HEADER_HT,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        padding: '1.75rem 1.35rem',
      },
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
    // FIXME: long lines like "Central African Republic" (flex/wrap weird)
    // titleText: {
    // flex: 0, // makes super long words not create too much empty space
    // },
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

export const PanelContentSimple: FC = (props) => {
  const { children } = props
  const { root } = usePanelRootStyles()

  return <div className={root}>{children}</div>
}

// WISHLIST: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelContent: FC<PanelContentProps> = (props) => {
  const { children, title, icon, subtitle } = props
  const { subSubtitle, extree, introParagraph } = props
  const classes = usePanelRootStyles()

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
    <div className={classes.root}>
      {Intro}
      <FiltersWarning />
      <div>{children}</div>
    </div>
  )
}
