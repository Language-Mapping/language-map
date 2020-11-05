/* eslint-disable operator-linebreak */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { panelWidths } from 'components/panels/config'

type StylesProps = {
  panelOpen: boolean
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      bottom: 56, // set directly in MUI to 56
      left: 2,
      opacity: (props: StylesProps) => (props.panelOpen ? 1 : 0),
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '1rem',
      position: 'absolute',
      right: 2,
      top: '45%',
      transition: '300ms ease all',
      transform: (props: StylesProps) =>
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
    closeBtn: {
      [theme.breakpoints.up('md')]: { display: 'none' },
    },
  })
)
