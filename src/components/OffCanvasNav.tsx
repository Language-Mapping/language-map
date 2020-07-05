import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

import { ToggleOffCanvasType } from './types'
import { Nav } from 'components'

const useStyles = makeStyles({
  list: {
    width: 290,
  },
})

type OffCanvasNavType = {
  open: boolean
  toggleDrawer: ToggleOffCanvasType
  setOpen: (open: boolean) => void
}

export const OffCanvasNav: FC<OffCanvasNavType> = ({
  open,
  setOpen,
  toggleDrawer,
}) => {
  const classes = useStyles()
  const closeIt = () => setOpen(false)

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={closeIt}
        onKeyDown={closeIt}
      >
        <Nav />
      </div>
    </Drawer>
  )
}