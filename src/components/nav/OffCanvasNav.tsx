import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

import { Nav } from 'components/nav'
import { ToggleOffCanvasNav } from './types'

type OffCanvasNavProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<boolean>
}

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

export const OffCanvasNav: FC<OffCanvasNavProps> = (props) => {
  const { isOpen, setIsOpen } = props
  const classes = useStyles()

  const closeIt = () => setIsOpen(!isOpen)

  const toggleDrawer: ToggleOffCanvasNav = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return null
    }

    setIsOpen(!isOpen)

    return null
  }

  // TODO: make the <nav> semantic. Well it already is but it's not visible
  // until the off-canvas is opened...
  return (
    <Drawer
      open={isOpen}
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
