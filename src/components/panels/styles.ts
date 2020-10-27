/* eslint-disable operator-linebreak */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'
import type { MapPanelProps } from './types'

type JustTheState = Pick<MapPanelProps, 'panelOpen'>

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      bottom: 56, // set directly in MUI to 56
      display: 'flex',
      flexDirection: 'column',
      left: 4,
      opacity: (props: JustTheState) => (props.panelOpen ? 1 : 0),
      overflowY: 'auto',
      position: 'fixed',
      right: 4,
      top: '45%',
      transition: '300ms ease all',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      transform: (props: JustTheState) =>
        `translateY(${props.panelOpen ? 0 : '100%'})`,
      [theme.breakpoints.up('md')]: {
        top: 24,
        left: 24,
        bottom: 92, // 36 + 56 (aka BottomNav `bottom` + `height`)
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
      [theme.breakpoints.up('md')]: { display: 'none' },
    },
  })
)
