import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { MOBILE_PANEL_HEADER_HEIGHT } from 'components/panels/config'

type MapPanelProps = { panelOpen?: boolean }

// TODO: standardize transitions (currently in here, map panels, and Fab)
// CRED: for `theme.transitions.create` example:
// https://medium.com/@octaviocoria/custom-css-transitions-with-react-material-ui-5d41cb2e7c5#fecb

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appWrapRoot: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      overflow: 'hidden',
      position: 'absolute',
      display: 'flex',
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
      [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
    },
    mapWrap: {
      width: '100%',
      transition: theme.transitions.create('all', {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.easeInOut,
      }),
      [theme.breakpoints.up('sm')]: {
        flexGrow: ({ panelOpen }: MapPanelProps) => (panelOpen ? 0 : 2),
        height: '100%',
      },
      [theme.breakpoints.down('sm')]: {
        minHeight: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? '50%' : `calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT})`,
        flexGrow: ({ panelOpen }: MapPanelProps) => (panelOpen ? 1 : 100),
        flexBasis: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? '50%' : `calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT})`,
        maxHeight: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? '50%' : `calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT})`,
        order: 1,
      },
    },
  })
)
