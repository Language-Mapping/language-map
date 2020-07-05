import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
} from '@material-ui/core'

import { ToggleOffCanvasType } from './types'

const useStyles = makeStyles({
  list: {
    width: 275,
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
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  )
}
