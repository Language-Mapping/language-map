import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const MOBILE_PANEL_HEADER_HEIGHT = '3rem'
export const DESKTOP_PANEL_HEADER_HEIGHT = '3.5rem'
export const panelWidths = { mid: 450, midLarge: 600 }

type MapPanelProps = {
  panelOpen?: boolean
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // formerly `mapWrapRoot`...
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
    // The actual map container
    mapWrap: {
      transition: theme.transitions.easing.easeInOut,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        flexGrow: ({ panelOpen }: MapPanelProps) => (panelOpen ? 1 : 100),
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
