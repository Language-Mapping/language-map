/* eslint-disable operator-linebreak */
import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import { FiChevronRight } from 'react-icons/fi'

import { GlobalContext } from 'components'
import { panelWidths } from 'components/panels/config'
import { smoothToggleTransition } from '../../utils'

type FabStyle = { panelOpen: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabPanelToggleRoot: {
      position: 'absolute',
      top: theme.spacing(2),
      left: theme.spacing(2),
      zIndex: 1,
      '& svg': {
        height: '1.5em',
        width: '1.5em',
        transform: (props: FabStyle) =>
          props.panelOpen ? 'rotateY(180deg)' : 'rotateY(0)',
      },
      [theme.breakpoints.up('md')]: {
        transform: (props: FabStyle) =>
          props.panelOpen
            ? `translateX(${panelWidths.mid}px)`
            : 'translateX(0)',
      },
      [theme.breakpoints.up('xl')]: {
        transform: (props: FabStyle) =>
          props.panelOpen
            ? `translateX(${panelWidths.midLarge}px)`
            : 'translateX(0)',
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    smoothTrans: {
      transition: (props: { panelOpen: boolean }) =>
        smoothToggleTransition(theme, props.panelOpen),
    },
  })
)

export const FabPanelToggle: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const panelOpen = state.panelState === 'default'
  const classes = useStyles({ panelOpen })

  return (
    <Fab
      color="primary"
      size="small"
      aria-label="toggle panel"
      className={`${classes.fabPanelToggleRoot} ${classes.smoothTrans}`}
      onClick={() =>
        dispatch({
          type: 'SET_PANEL_STATE',
          payload: panelOpen ? 'minimized' : 'default',
        })
      }
    >
      <FiChevronRight className={classes.smoothTrans} />
    </Fab>
  )
}
