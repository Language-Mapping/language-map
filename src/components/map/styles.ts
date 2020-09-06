import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const MOBILE_PANEL_HEADER_HEIGHT = '3rem'
export const DESKTOP_PANEL_HEADER_HEIGHT = '3.5rem'

export const panelWidths = { mid: 375, midLarge: 475 }

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
      [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    // The actual map container
    mapWrap: {
      flexGrow: 1,
      flexShrink: 0,
      [theme.breakpoints.down('sm')]: { height: '50%' },
    },
  })
)
