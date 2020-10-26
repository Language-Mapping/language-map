/* eslint-disable operator-linebreak */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths, MOBILE_PANEL_HEADER_HT } from 'components/panels/config'
import { MapPanelProps } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      width: '100%',
      transition: '300ms ease all',
      [theme.breakpoints.down('sm')]: {
        height: '50%',
        top: (props: MapPanelProps) =>
          props.panelOpen ? '50%' : `calc(100% - ${MOBILE_PANEL_HEADER_HT})`,
        position: 'absolute',
      },
      [theme.breakpoints.up('md')]: {
        order: 1,
        transform: (props: MapPanelProps) =>
          `translateX(${props.panelOpen ? 0 : '-100%'})`,
        width: panelWidths.mid,
      },
      [theme.breakpoints.up('xl')]: {
        width: panelWidths.midLarge,
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
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
