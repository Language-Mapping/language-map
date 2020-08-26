import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { panelWidths } from 'components/map/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBarRoot: {
      position: 'relative',
      display: 'flex',
      textAlign: 'center',
      // Direct children relative position so `zIndex` can be used
      '& > *': {
        position: 'relative',
      },
      '& a, & a:visited': {
        color: `${theme.palette.common.black} !important`,
        display: 'inline-flex',
        flexDirection: 'column',
        textDecoration: 'none',
      },
    },
    // These spacers allow the title to "center" between the side panel and map
    // control buttons via flexbox and the addition of a couple divs.
    spacerDesktop: {
      flex: 1,
      height: 0,
      visibility: 'hidden',
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    },
    spacerRight: {
      marginRight: theme.spacing(2),
    },
    spacerLeft: {
      [theme.breakpoints.up('md')]: {
        marginLeft: panelWidths.mid,
      },
      [theme.breakpoints.up('lg')]: {
        marginLeft: panelWidths.midLarge,
      },
    },
    title: {
      zIndex: 1,
      [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(1),
      },
    },
    titleMain: {
      // lineHeight: 1, // single-line anyway, and allows for reliance on gutter
      // Horizontal padding allows the background image to extend past text
      paddingLeft: '0.15em',
      paddingRight: '0.15em',
      // CRED: css-tricks.com/snippets/css/css-linear-gradient/#hard-color-stops
      backgroundImage: `
      linear-gradient(
        to top, 
        transparent,
        transparent 0.165em,
        gold 0.165em,
        gold 0.24em,
        transparent 0.24em,
        transparent 100%
      )`,
    },
    subtitle: {
      color: theme.palette.grey[800],
      fontSize: '0.32em',
      marginTop: '-0.4em',
    },
  })
)

export const TopBar: FC = () => {
  const classes = useStyles()
  const {
    spacerDesktop,
    spacerLeft,
    spacerRight,
    subtitle,
    title,
    titleMain,
    topBarRoot,
  } = classes

  return (
    <>
      {/* Need the `id` in order to find unique element for `map.setPadding` */}
      <header className={topBarRoot} id="page-header">
        <div className={`${spacerDesktop} ${spacerLeft}`} />
        <Typography variant="h2" component="h1" className={title}>
          <RouteLink to="/">
            <span className={titleMain}>Languages</span>
            <span className={subtitle}>of New York City</span>
          </RouteLink>
        </Typography>
        <div className={`${spacerDesktop} ${spacerRight}`} />
      </header>
    </>
  )
}
