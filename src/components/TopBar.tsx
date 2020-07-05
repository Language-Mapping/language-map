import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core'
import { MdMenu } from 'react-icons/md'

import { ToggleOffCanvasType } from './types'
import { OffCanvasNav } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

export const TopBar: FC = () => {
  const classes = useStyles()
  const [offCanvasOpen, setOffCanvasOpen] = useState<boolean>(false)

  const toggleDrawer: ToggleOffCanvasType = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return null
    }

    setOffCanvasOpen(open)
    return null
  }

  return (
    <>
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MdMenu />
            </IconButton>
            <Typography
              variant="h5"
              component="h1"
              className={classes.title}
              align="center"
            >
              Languages of New York City
            </Typography>
            {/* Empty placeholder to keep flexbox intact */}
            <div></div>
          </Toolbar>
        </AppBar>
      </div>
      <OffCanvasNav
        open={offCanvasOpen}
        setOpen={setOffCanvasOpen}
        toggleDrawer={toggleDrawer}
      />
    </>
  )
}
