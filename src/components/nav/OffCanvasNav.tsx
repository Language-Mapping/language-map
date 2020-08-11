import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

import { Nav } from 'components/nav'
import { ToggleOffCanvasType } from './types'

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
        // getByRole returned more than one presentation element
        data-testid="backdrop"
        role="presentation"
        className={classes.list}
        onClick={closeIt}
        onKeyDown={closeIt}
      >
        <Nav />
      </div>
    </Drawer>
  )
}
