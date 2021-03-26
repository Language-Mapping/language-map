import React, { FC, useEffect } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from '@material-ui/core'

import { GoSearch } from 'react-icons/go'
import { MdClose } from 'react-icons/md'
import { BiHomeAlt } from 'react-icons/bi'

import { HideOnScroll } from 'components/generic'
import { usePanelDispatch } from 'components/panels'
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
    colorDefault: {
      backgroundColor: 'transparent',
    },
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

export const PanelTitleBar: FC = (props) => {
  const classes = useStyles()
  const { pathname } = useLocation()
  const panelHeading = pathname.split('/')[1] || 'Languages of NYC'
  const panelDispatch = usePanelDispatch()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS' })
  }

  useEffect(() => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS', payload: false })
  }, [panelDispatch, pathname])

  const ToggleSearchPanelBtn = (
    <Tooltip title="Toggle search menu">
      <IconButton
        size="small"
        aria-label="toggle search menu"
        color="inherit"
        onClick={handleClick}
      >
        <GoSearch />
      </IconButton>
    </Tooltip>
  )

  const RightSideBtns = (
    <div className={classes.rightSideBtns}>
      <Route path="/Explore">{ToggleSearchPanelBtn}</Route>
      <Tooltip title="Close panel">
        <IconButton
          size="small"
          aria-label="panel close"
          color="inherit"
          onClick={() =>
            panelDispatch({ type: 'TOGGLE_MAIN_PANEL', payload: false })
          }
        >
          <MdClose />
        </IconButton>
      </Tooltip>
    </div>
  )

  // WISHLIST: add maximize btn on mobile
  // WISHLIST: MAKE AUTO-HIDE WORK 😞
  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Toolbar variant="dense" className={classes.toolbar}>
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
