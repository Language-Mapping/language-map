/* eslint-disable operator-linebreak */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import {
  MOBILE_PANEL_HEADER_HEIGHT,
  panelWidths,
} from 'components/panels/config'
import { smoothToggleTransition } from '../../utils'
import { MapPanelProps } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      transition: (props: MapPanelProps) =>
        smoothToggleTransition(theme, props.panelOpen),
      [theme.breakpoints.down('sm')]: {
        order: 2,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 calc(50% - ${MOBILE_PANEL_HEADER_HEIGHT})` : 0,
        maxHeight: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? '50%' : MOBILE_PANEL_HEADER_HEIGHT,
      },
      [theme.breakpoints.up('md')]: {
        opacity: ({ panelOpen }: MapPanelProps) => (panelOpen ? 1 : 0),
        transform: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? 'translateX(0%)' : `translateX(-${panelWidths.mid}px)`,
        maxWidth: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? panelWidths.mid : 0,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 ${panelWidths.mid}px` : 0,
      },
      [theme.breakpoints.up('xl')]: {
        transform: ({ panelOpen }: MapPanelProps) =>
          panelOpen
            ? 'translateX(0%)'
            : `translateX(-${panelWidths.midLarge}px)`,
        maxWidth: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? panelWidths.midLarge : 0,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 ${panelWidths.midLarge}px` : 0,
      },
      '& .MuiPaper-root': { height: '100%', overflowY: 'auto' },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
      },
    },
    contentWrap: {
      display: 'flex',
      overflowX: 'hidden',
      overflowY: 'auto',
      paddingBottom: '1rem',
      width: '200%',
    },
    panelContent: {
      padding: '0.25rem 0.8rem',
      width: '100%',
      transition: (props: MapPanelProps) =>
        smoothToggleTransition(theme, props.active),
      opacity: (props: MapPanelProps) => (props.active ? 1 : 0),
      // Slide in/out left/right when active based on active and first
      transform: (props: MapPanelProps) => {
        if (props.active && props.first) return 'translateX(0)' // 1st, active
        if (props.first) return 'translateX(-100%)' // 1st, inactive
        if (props.active) return 'translateX(-100%)' // 2nd, active

        return 'translateX(100%)' // 2nd, inactive
      },
      [theme.breakpoints.up('sm')]: { padding: '1rem' },
      [theme.breakpoints.up('xl')]: { padding: '1.25rem' }, // tons of room
    },
  })
)
