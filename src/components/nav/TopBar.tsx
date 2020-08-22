import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBarRoot: {
      // NICE. faders.
      // backgroundColor: fade(theme.palette.primary.main, 0.75),
      position: 'relative',
      [theme.breakpoints.down('sm')]: {
        // TODO: make it like desktop, as in don't take up the full width on
        // mobile as it makes the map under it unreachable.
        marginLeft: theme.spacing(1),
        zIndex: 1,
      },
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        textAlign: 'center',
      },
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
      // TODO: // [theme.breakpoints.up(MID_BREAKPOINT)]: {}
    },
    // These spacers allow the title to "center" between the side panel and map
    // control buttons via flexbox and the addition of a couple divs.
    spacerDesktop: {
      flex: 1,
      height: 0,
      visibility: 'hidden',
    },
    spacerRight: {
      marginRight: theme.spacing(2),
    },
    spacerLeft: {
      marginLeft: 500, // TODO: de-fragilize
    },
    title: {
      zIndex: 1,
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
      clear: 'both',
      color: theme.palette.grey[800],
      fontSize: '0.32em',
      marginTop: '-0.4em',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'left',
        marginLeft: '2.6em',
      },
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
