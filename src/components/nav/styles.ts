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
    logo: {
      height: '3.5rem',
      [theme.breakpoints.up('sm')]: { height: '5rem' },
    },
    title: {
      zIndex: 1,
    },
  })
)
