import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

import { GlobalContext } from 'components'
import { Nav } from 'components/nav'
import { ToggleOffCanvasNav } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    offCanvasNavRoot: {
      cursor: 'pointer',
    },
    offCanvasNavList: {
      width: 300,
    },
  })
)

export const OffCanvasNav: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const offCanvasOpen = state.offCanvasNavOpen
  const classes = useStyles()

  const closeIt = () => dispatch({ type: 'TOGGLE_OFF_CANVAS_NAV' })

  const toggleDrawer: ToggleOffCanvasNav = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return null
    }

    dispatch({
      type: 'TOGGLE_OFF_CANVAS_NAV',
    })

    return null
  }

  // TODO: make the <nav> semantic. Well it already is but it's not visible
  // until the off-canvas is opened...
  return (
    <Drawer
      open={offCanvasOpen}
      onClose={toggleDrawer(false)}
      className={classes.offCanvasNavRoot}
    >
      <div
        role="presentation"
        onClick={closeIt}
        className={classes.offCanvasNavList}
      >
        <Nav />
      </div>
    </Drawer>
  )
}
