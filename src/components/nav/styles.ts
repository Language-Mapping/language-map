import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'

type NavStyleProps = {
  panelOpen?: boolean
  logoLineColor?: string
  logoHorizPadding?: string
}

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
    spacerDesktop: {
      flex: 1,
      visibility: 'hidden',
      transition: '300ms ease all',
      [theme.breakpoints.down('sm')]: { display: 'none' },
    },
    spacerLeft: {
      marginLeft: (props: NavStyleProps) =>
        props.panelOpen ? panelWidths.mid : 0,
      [theme.breakpoints.up('xl')]: {
        marginLeft: (props: NavStyleProps) =>
          props.panelOpen ? panelWidths.midLarge : 0,
      },
    },
    title: {
      zIndex: 1,
      [theme.breakpoints.down('md')]: { marginLeft: theme.spacing(1) },
    },
    titleMain: {
      // lineHeight: 1, // single-line anyway, and allows for reliance on gutter
      // Horizontal padding allows the background image to extend past text
      padding: (props: NavStyleProps) =>
        `0 ${props.logoHorizPadding || '0.15em'}`,
      // CRED: css-tricks.com/snippets/css/css-linear-gradient/#hard-color-stops
      backgroundImage: (props: NavStyleProps) => `
      linear-gradient(
        to top, 
        transparent,
        transparent 0.165em,
        ${props.logoLineColor || 'gold'} 0.165em,
        ${props.logoLineColor || 'gold'} 0.24em,
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
