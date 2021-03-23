import React, { FC } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import { GoGear, GoSearch } from 'react-icons/go'
import { MdClose } from 'react-icons/md'
import { BiHomeAlt } from 'react-icons/bi'

import { HideOnScroll } from 'components/generic'
import { PanelTitleBarProps } from './types'
import { navRoutes } from './config'
import { SplitCrumbs } from './SplitCrumbs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // TODO: rm when done
    // root: {
    //   boxShadow: '0 2px 7px hsla(0, 0%, 0%, 0.25)',
    //   height: MOBILE_PANEL_HEADER_HT,
    //   position: 'absolute',
    //   top: 0,
    //   width: '100%',
    // btnsContainer: {
    //   backgroundColor: 'transparent',
    //   boxShadow: '-15px 0px 7px 0px hsla(168, 41%, 29%, 0.5)',
    // },
    toolbar: {
      backgroundColor: theme.palette.primary.dark,
      padding: '0 0.75rem',
      justifyContent: 'space-between',
      borderTopLeftRadius: 4, // same as bottom left/right in nav bar
      borderTopRightRadius: 4, // same as bottom left/right in nav bar
    },
    panelTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.85rem',
    },
    panelHeadingIcon: {
      color: theme.palette.text.secondary,
      marginRight: 4,
    },
    rightSideBtns: {
      '& > * + *': {
        marginLeft: 8,
      },
    },
  })
)

type PanelTitleProps = {
  text: string
}

const PanelTitle: FC<PanelTitleProps> = (props) => {
  const { text } = props
  const classes = useStyles()
  // TODO: make sure there are icons for all top-level views
  const panelIcon = navRoutes.find(({ heading }) => heading === text)?.icon || (
    <BiHomeAlt />
  )

  return (
    <div className={classes.panelTitle}>
      <IconButton
        size="small"
        edge="start"
        aria-label="current panel icon"
        color="inherit"
        className={classes.panelHeadingIcon}
      >
        {panelIcon}
      </IconButton>
      <Typography variant="h6" component="h2">
        {text}
      </Typography>
    </div>
  )
}

export const PanelTitleBar: FC<PanelTitleBarProps> = (props) => {
  const { setPanelOpen } = props
  const classes = useStyles()
  const { pathname } = useLocation()
  const panelHeading = pathname.split('/')[1] || 'Languages of NYC'

  const ToggleSearchPanelBtn = (
    <IconButton size="small" aria-label="toggle search panel" color="inherit">
      <GoSearch />
    </IconButton>
  )

  const RightSideBtns = (
    <div className={classes.rightSideBtns}>
      <Switch>
        <Route path="/" exact />
        <Route>{ToggleSearchPanelBtn}</Route>
      </Switch>
      <IconButton
        size="small"
        aria-label="map settings and options"
        color="inherit"
      >
        <GoGear />
      </IconButton>
      <IconButton
        size="small"
        aria-label="panel close"
        color="inherit"
        onClick={() => setPanelOpen(false)}
      >
        <MdClose />
      </IconButton>
    </div>
  )

  // WISHLIST: add maximize btn on mobile
  return (
    <HideOnScroll {...props}>
      <AppBar position="sticky">
        <Toolbar variant="dense" className={classes.toolbar}>
          {/* Top-level non-Home get Home link */}
          <Switch>
            <Route path={['/:anything', '/']} exact>
              <PanelTitle text={panelHeading} />
            </Route>
            <Route>
              <SplitCrumbs />
            </Route>
          </Switch>
          {RightSideBtns}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}
