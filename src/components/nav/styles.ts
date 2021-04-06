import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'

type NavStyleProps = {
  panelOpen?: boolean
  logoLineColor?: string
  logoHorizPadding?: string
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      textAlign: 'center',
      top: '0.5rem',
      left: '0.5rem',
      [theme.breakpoints.up('sm')]: { top: '1rem' },
      [theme.breakpoints.up('md')]: { top: 20 },
      [theme.breakpoints.up('xl')]: { top: 24 },
      // Direct children relative position so `zIndex` can be used
      '& > *': { position: 'relative' },
      '& a, & a:visited': {
        display: 'inline-flex',
        flexDirection: 'column',
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
    logo: {
      height: '2.75rem',
      [theme.breakpoints.up('sm')]: { height: '3.5rem' },
      [theme.breakpoints.up('md')]: { height: '4rem' },
      [theme.breakpoints.up('lg')]: { height: '4.5rem' },
      [theme.breakpoints.up('xl')]: { height: '5rem' },
    },
    title: {
      zIndex: 1,
    },
  })
)
