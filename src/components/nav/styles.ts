import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBarRoot: {
      position: 'relative',
      display: 'flex',
      textAlign: 'center',
      // Direct children relative position so `zIndex` can be used
      '& > *': { position: 'relative' },
      '& a, & a:visited': {
        color: `${theme.palette.common.black} !important`,
        display: 'inline-flex',
        flexDirection: 'column',
        textDecoration: 'none',
      },
    },
    // These spacers allow the title to "center" between the side panel and map
    // control buttons via flexbox and the addition of a couple divs.
    // TODO: make it right
    spacerDesktop: {
      flex: 1,
      height: 0,
      visibility: 'hidden',
      display: 'none',
      [theme.breakpoints.up('md')]: { display: 'block' },
    },
    spacerRight: { marginRight: theme.spacing(2) },
    spacerLeft: {
      [theme.breakpoints.up('md')]: { marginLeft: panelWidths.mid },
      [theme.breakpoints.up('lg')]: { marginLeft: panelWidths.midLarge },
    },
    title: {
      zIndex: 1,
      [theme.breakpoints.down('md')]: { marginLeft: theme.spacing(1) },
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
      // Steady regardless of light/dark theme BUT not MB background map:
      color: theme.palette.grey[800],
      fontSize: '0.32em',
      marginTop: '-0.4em',
    },
  })
)
