import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import { FiChevronDown } from 'react-icons/fi'
import { GlobalContext } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelCloseBtn: {
      position: 'absolute',
      right: '0.5em',
      transition: '300ms transform',
      transformOrigin: 'center center',
      transform: (props: { panelOpen: boolean }) =>
        props.panelOpen ? 'rotate(0deg)' : 'rotate(180deg)',
      [theme.breakpoints.up('md')]: { display: 'none' },
    },
  })
)

export const PanelCloseBtn: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles({
    panelOpen: state.panelState === 'default',
  })

  return (
    <IconButton
      edge="end"
      color="inherit"
      className={classes.panelCloseBtn}
      onClick={() => {
        const nextPanelState =
          state.panelState === 'default' ? 'minimized' : 'default'

        dispatch({ type: 'SET_PANEL_STATE', payload: nextPanelState })
      }}
    >
      <FiChevronDown />
    </IconButton>
  )
}
