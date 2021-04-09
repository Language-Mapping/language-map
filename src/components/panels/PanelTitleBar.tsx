import React, { FC, useEffect } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { AppBar, IconButton, Toolbar, Tooltip } from '@material-ui/core'
import { HiOutlineSearch } from 'react-icons/hi'
import { CgClose } from 'react-icons/cg'

import { usePanelDispatch } from 'components/panels'
import { routes } from 'components/config/api'
import { SplitCrumbs } from './SplitCrumbs'
import { PanelTitleRoutes } from './PanelTitleRoutes'

type StyleProps = { hide?: boolean }

const topCornersRadius = 4 // same as bottom left/right in nav bar
const borderTopLeftRadius = topCornersRadius
const borderTopRightRadius = topCornersRadius

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderTopLeftRadius,
      borderTopRightRadius,
      transition: '300ms all',
      transform: (props: StyleProps) =>
        props.hide ? 'translateY(-40px)' : 'translateY(0)',
      opacity: (props: StyleProps) => (props.hide ? 0 : 1),
      maxHeight: (props: StyleProps) => (props.hide ? 0 : 48),
      zIndex: (props: StyleProps) => (props.hide ? -1 : 1),
    },
    toolbar: {
      backgroundColor: theme.palette.primary.dark,
      borderTopLeftRadius,
      borderTopRightRadius,
      padding: '0 0.5rem',
      justifyContent: 'space-between',
    },
    rightSideBtns: {
      '& > * + *': {
        marginLeft: 4,
      },
    },
  })
)

const PanelCloseBtn: FC = (props) => {
  const { pathname } = useLocation()
  const panelDispatch = usePanelDispatch()

  useEffect(() => {
    panelDispatch({ type: 'TOGGLE_SEARCH_TABS', payload: false })
  }, [panelDispatch, pathname])

  return (
    <Tooltip title="Close panel">
      <IconButton
        size="small"
        aria-label="panel close"
        color="inherit"
        onClick={() =>
          panelDispatch({ type: 'TOGGLE_MAIN_PANEL', payload: false })
        }
      >
        <CgClose />
      </IconButton>
    </Tooltip>
  )
}

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

export const PanelTitleBar: FC<{ hide: boolean }> = (props) => {
  const { hide } = props
  const classes = useStyles({ hide })
  const { pathname } = useLocation()
  // Lil' gross, but use Level2 route name first, otherwise Level1
  const panelTitle = pathname.split('/')[2] || pathname.split('/')[1]

  const RightSideBtns = (
    <div className={classes.rightSideBtns}>
      <Route path="/Explore">
        <ToggleSearchMenuBtn />
      </Route>
      <PanelCloseBtn />
    </div>
  )

  // WISHLIST: add maximize btn on mobile
  return (
    <AppBar className={classes.root} position="sticky">
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
        {RightSideBtns}
      </Toolbar>
    </AppBar>
  )
}
