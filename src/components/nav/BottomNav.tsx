import React, { FC, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  createStyles,
  makeStyles,
  Theme,
  lighten,
} from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'

import { usePanelState, usePanelDispatch } from 'components/panels'
import { routes } from 'components/config/api'
import { navRoutes } from '../panels/config'
import { BOTTOM_NAV_HEIGHT_MOBILE } from './config'

const useStyles = makeStyles((theme: Theme) => {
  const gradientBackground = `radial-gradient(ellipse at top, ${theme.palette.primary.light}, transparent),
radial-gradient(ellipse at bottom, ${theme.palette.primary.dark}, transparent)`

  return createStyles({
    root: {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
      zIndex: 1,
      width: '100%',
      [theme.breakpoints.down('md')]: {
        boxShadow: '0px -5px 5px 0px rgba(0,0,0,0.1)',
        borderRadius: 0,
        height: BOTTOM_NAV_HEIGHT_MOBILE,
        order: 2, // relative to panel content
      },
    },
    // TODO: clip-path notch instead of boring rounded corners
    bottomNavActionRoot: {
      minWidth: 'auto', // 80 = too-large default,
      // Probably NOT light/dark theme interchangeable:
      outline: `solid 1px hsla(168, 41%, 19%, 0.15)`,
      transition: 'all 300ms ease',
      '&:hover': {
        [theme.breakpoints.up('sm')]: {
          background: lighten(theme.palette.primary.dark, 0.1),
        },
      },
      '& svg': {
        transition: '300ms ease all',
        fontSize: '1.25rem',
      },
      // Quite a fight, may be a bug with MUI, which adds "selected" classes to
      // both the root and child elements. More below in "label" class too.
      '& .Mui-selected': {
        background: 'none',
        fontSize: 'inherit',
      },
      // This one is legit (it's the root element).
      '&.Mui-selected': {
        color: theme.palette.text.primary,
      },
    },
    wrapper: {
      fontSize: '0.85rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
    label: {
      '& .Mui-selected': {
        fontSize: 'inherit', // from the wrapper class
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
      },
    },
    selected: {
      background: gradientBackground,
      '& svg': {
        fill: theme.palette.text.primary,
      },
    },
  })
})

// TODO: make this work dynamically, simply by checking if there's more than one
// slash in the pathname, then setting this state if so.
const initialSubRoutes = {
  Info: routes.info,
  Explore: routes.explore,
}

export const BottomNav: FC = (props) => {
  const { pathname } = useLocation()
  const classes = useStyles()
  const { bottomNavActionRoot, selected, label, wrapper } = classes
  const { panelOpen } = usePanelState()
  const panelDispatch = usePanelDispatch()
  const [subRoutePath, setSubRoutePath] = useState(
    initialSubRoutes as { [key: string]: string }
  )

  const currPathSansSlash = pathname.split('/')[1]
  const current = currPathSansSlash || '/'

  const handleChange = React.useCallback(
    (newValue: string): void => {
      if (!panelOpen) {
        panelDispatch({ type: 'TOGGLE_MAIN_PANEL', payload: true })

        return
      }

      if (newValue === pathname) {
        panelDispatch({ type: 'TOGGLE_MAIN_PANEL', payload: false })

        return
      }

      const correspRoute = subRoutePath[currPathSansSlash]

      if (correspRoute) {
        setSubRoutePath({ ...subRoutePath, [currPathSansSlash]: pathname })
      }
    },
    [currPathSansSlash, panelDispatch, panelOpen, pathname, subRoutePath]
  )

  // Route changes should only affect their corresponding item
  useEffect(() => {
    const correspRoute = subRoutePath[currPathSansSlash]

    if (!correspRoute) return

    if (pathname.includes(correspRoute) || correspRoute.includes(pathname)) {
      setSubRoutePath({
        ...subRoutePath,
        [currPathSansSlash]: `/${currPathSansSlash}`,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const NavActions = navRoutes.map((config) => {
    const { rootPath } = config
    const subRouteStateKey = rootPath.split('/')[1] || '/'
    const to = subRoutePath[subRouteStateKey] || rootPath

    return (
      <BottomNavigationAction
        key={config.heading}
        component={NavLink}
        label={config.heading}
        icon={config.icon}
        value={subRouteStateKey}
        to={to}
        showLabel
        classes={{ root: bottomNavActionRoot, selected, label, wrapper }}
      />
    )
  })

  return (
    <BottomNavigation
      id="bottom-nav"
      value={current}
      // component="nav" // TODO: restore w/o errors
      onChange={(event, newValue) => {
        handleChange(newValue)
      }}
      className={classes.root}
    >
      {NavActions}
    </BottomNavigation>
  )
}
