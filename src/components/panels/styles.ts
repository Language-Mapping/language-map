/* eslint-disable operator-linebreak */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import { smoothToggleTransition } from '../../utils'
import { MapPanelProps } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      height: '100%',
      transition: (props: MapPanelProps) =>
        smoothToggleTransition(theme, props.panelOpen),
      [theme.breakpoints.up('sm')]: {
        order: 1,
      },
      [theme.breakpoints.up('md')]: {
        maxWidth: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? panelWidths.mid : 0,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 ${panelWidths.mid}px` : 0,
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? panelWidths.midLarge : 0,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 ${panelWidths.midLarge}px` : 0,
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
      },
    },
    contentWrap: {
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '0.25rem 1em 1em',
      [theme.breakpoints.up('xl')]: { padding: '1.25em' }, // tons of room
    },
  })
)
