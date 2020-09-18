/* eslint-disable operator-linebreak */
import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import { FiChevronRight } from 'react-icons/fi'

import { GlobalContext } from 'components'
import { panelWidths } from 'components/panels/config'

type FabStyle = { panelOpen: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabPanelToggleRoot: {
      position: 'absolute',
      zIndex: 1,
      top: (props: FabStyle) => (props.panelOpen ? 6 : 16),
      transition: '300ms ease all',
      '& svg': {
        height: '1.5em',
        width: '1.5em',
        transition: '300ms ease transform',
        transform: (props: FabStyle) =>
          props.panelOpen ? 'rotateY(180deg)' : 'rotateY(0)',
      },
      [theme.breakpoints.up('md')]: {
        left: (props: FabStyle) =>
          props.panelOpen ? `${panelWidths.mid - 20}px` : 16,
      },
      [theme.breakpoints.up('xl')]: {
        left: (props: FabStyle) =>
          props.panelOpen ? `${panelWidths.midLarge - 20}px` : 16,
      },
      [theme.breakpoints.down('sm')]: { display: 'none' },
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
      className={classes.fabPanelToggleRoot}
      onClick={() =>
        dispatch({
          type: 'SET_PANEL_STATE',
          payload: panelOpen ? 'minimized' : 'default',
        })
      }
    >
      <FiChevronRight />
    </Fab>
  )
}
