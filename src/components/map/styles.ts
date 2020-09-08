import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { MOBILE_PANEL_HEADER_HEIGHT } from 'components/panels/config'
import { smoothToggleTransition } from '../../utils'

type MapPanelProps = { panelOpen?: boolean }

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
      transition: (props: MapPanelProps) =>
        smoothToggleTransition(theme, props.panelOpen),
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
