/* eslint-disable operator-linebreak */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import { MapPanelProps } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      bottom: 56, // set directly in MUI to 56
      display: 'flex',
      flexDirection: 'column',
      left: 4,
      opacity: (props: MapPanelProps) => (props.panelOpen ? 1 : 0),
      overflowY: 'auto',
      position: 'fixed',
      right: 4,
      top: '45%',
      transition: '300ms ease all',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      transform: (props: MapPanelProps) =>
        `translateY(${props.panelOpen ? 0 : '100%'})`,
      [theme.breakpoints.up('md')]: {
        top: 24,
        left: 24,
        bottom: 100,
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
      padding: '1em',
      position: 'relative',
    },
    closeBtn: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
    },
  })
)
