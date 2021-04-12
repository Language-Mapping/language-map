import React, { FC, useState } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  Popover,
  AppBar,
  Hidden,
  IconButton,
  Toolbar,
  Tooltip,
} from '@material-ui/core'
import { HiOutlineSearch } from 'react-icons/hi'

import { PanelCloseBtn } from 'components/panels'
import { routes } from 'components/config/api'
import { PANEL_TITLE_BAR_HT_MOBILE } from 'components/nav/config'
import { SplitCrumbs } from './SplitCrumbs'
import { PanelTitleRoutes } from './PanelTitleRoutes'
import { PanelTitleBarProps } from './types'
import { SearchTabs } from './SearchTabs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: '300ms all',
      position: 'absolute',
      top: 0,
      width: '100%',
      boxShadow: theme.shadows[12],
      [theme.breakpoints.down('sm')]: {
        boxShadow:
          '0px 11px 10px 0px rgb(0 0 0 / 18%), 0px 24px 38px 3px rgb(0 0 0 / 12%), 0px 9px 46px 8px rgb(0 0 0 / 10%)',
      },
    },
    paper: {
      padding: '0 0.75rem 0.75rem',
      [theme.breakpoints.only('xs')]: {
        maxWidth: '100vw',
      },
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

const ToggleSearchMenuBtn: FC = (props) => {
  const { children } = props
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'map-menu-popover' : undefined
  const classes = useStyles()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <>
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
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ className: classes.paper, elevation: 24 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {children}
      </Popover>
    </>
  )
}

export const PanelTitleBar: FC<PanelTitleBarProps> = (props) => {
  const { mapRef } = props
  const classes = useStyles({})
  const { pathname } = useLocation()
  // Lil' gross, but use Level2 route name first, otherwise Level1
  const panelTitle = pathname.split('/')[2] || pathname.split('/')[1]

  // WISHLIST: add maximize btn on mobile
  return (
    <AppBar className={classes.root} position="static">
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
            <ToggleSearchMenuBtn>
              {mapRef && <SearchTabs mapRef={mapRef} />}
            </ToggleSearchMenuBtn>
          </Route>
          <Hidden smDown>
            <PanelCloseBtn />
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  )
}
