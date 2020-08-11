import React, { FC, useState } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core'
import { MdMenu } from 'react-icons/md'

import { OffCanvasNav, AboutLinkAsIcon } from 'components/nav'
import { ToggleOffCanvasType } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: fade(theme.palette.primary.main, 0.75),
      '& a, & a:visited': {
        textDecoration: 'none',
        color: theme.palette.common.white,
      },
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      '& a': {
        fontFamily: 'inherit',
      },
    },
    aboutIconButton: {
      fill: theme.palette.common.white,
    },
    toolbar: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
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
      {/* Need the `id` in order to find unique element for `map.setPadding` */}
      <AppBar position="fixed" className={classes.appBar} id="page-header">
        <Toolbar variant="dense" className={classes.toolbar}>
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
            <RouteLink to="/">Languages of New York City</RouteLink>
          </Typography>
          <AboutLinkAsIcon muiClass={classes.aboutIconButton} />
        </Toolbar>
      </AppBar>
      <OffCanvasNav
        open={offCanvasOpen}
        setOpen={setOffCanvasOpen}
        toggleDrawer={toggleDrawer}
      />
    </>
  )
}
