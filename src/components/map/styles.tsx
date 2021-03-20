import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { MOBILE_PANEL_HEADER_HT, panelWidths } from 'components/panels/config'

type StyleProps = { panelOpen?: boolean }

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appWrapRoot: {
      bottom: 0,
      display: 'flex',
      left: 0,
      overflow: 'hidden',
      position: 'absolute',
      right: 0,
      top: 0,
      [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    mapWrap: {
      flex: 1,
      position: 'absolute',
      right: 0,
      top: 0,
      transition: '300ms ease all',
      [theme.breakpoints.down('sm')]: {
        left: 0,
        bottom: (props: StyleProps) =>
          props.panelOpen ? '50%' : MOBILE_PANEL_HEADER_HT,
      },
      [theme.breakpoints.up('md')]: {
        bottom: 0,
        left: (props: StyleProps) => (props.panelOpen ? panelWidths.mid : 0),
      },
      [theme.breakpoints.up('xl')]: {
        left: (props: StyleProps) =>
          props.panelOpen ? panelWidths.midLarge : 0,
      },
    },
    contentWrap: {
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '0.25rem 0.75em 1em',
      position: 'relative',
      [theme.breakpoints.up('md')]: {
        paddingLeft: '1em',
        paddingRight: '1em',
      },
    },
  })
)

export const useLocalPanelStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '1rem',
      '& .mapboxgl-ctrl-geocoder': {
        maxWidth: '100%',
        width: 'auto',
      },
      '& .mapboxgl-ctrl-geocoder--input': {
        padding: '0.15rem 1rem 0.15rem 2.25rem', // huge horiz padding for icon
      },
    },
    switchFormCtrlRoot: {
      marginLeft: 0,
    },
    controlLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    smallerText: {
      fontSize: '0.8rem',
    },
  })
)
