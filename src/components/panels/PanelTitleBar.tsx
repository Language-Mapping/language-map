import React, { FC, useEffect } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { AppBar, Hidden, IconButton, Toolbar, Tooltip } from '@material-ui/core'
import { HiOutlineSearch } from 'react-icons/hi'

import { usePanelDispatch, PanelCloseBtn } from 'components/panels'
import { routes } from 'components/config/api'
import { PANEL_TITLE_BAR_HT_MOBILE } from 'components/nav/config'
import { SplitCrumbs } from './SplitCrumbs'
import { PanelTitleRoutes } from './PanelTitleRoutes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: '300ms all',
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    toolbar: {
      backgroundColor: theme.palette.primary.dark,
      padding: '0 0.5rem',
      justifyContent: 'space-between',
      [theme.breakpoints.only('xs')]: {
        minHeight: PANEL_TITLE_BAR_HT_MOBILE,
      },
    },
    rightSideBtns: {
      '& > * + *': {
        marginLeft: 4,
      },
    },
  })
)

const ToggleSearchMenuBtn: FC = () => {
  const { pathname } = useLocation()
  const panelDispatch = usePanelDispatch()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS' })
  }

  useEffect(() => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS', payload: false })
  }, [panelDispatch, pathname])

  return (
    <Tooltip title="Toggle search menu">
      <IconButton
        size="small"
        aria-label="toggle search menu"
        color="inherit"
        onClick={handleClick}
      >
        <HiOutlineSearch />
      </IconButton>
    </Tooltip>
  )
}

export const PanelTitleBar: FC = (props) => {
  const classes = useStyles({})
  const { pathname } = useLocation()
  // Lil' gross, but use Level2 route name first, otherwise Level1
  const panelTitle = pathname.split('/')[2] || pathname.split('/')[1]

  // WISHLIST: add maximize btn on mobile
  return (
    <AppBar className={classes.root} position="static" elevation={16}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <Switch>
          {/* Census can just have home btn */}
          <Route path={routes.local} />
          <Route path={['/', '/:level1']} exact />
          <Route>
            <SplitCrumbs />
          </Route>
        </Switch>
        <PanelTitleRoutes panelTitle={panelTitle} />
        <div className={classes.rightSideBtns}>
          <Route path="/Explore">
            <ToggleSearchMenuBtn />
          </Route>
          <Hidden smDown>
            <PanelCloseBtn />
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  )
}
