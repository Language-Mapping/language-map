import React, { FC, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'

import { RouteLocation } from 'components/config/types'
import { navRoutes, panelWidths } from '../panels/config'
import { BOTTOM_NAV_HEIGHT_MOBILE } from './config'
import { BottomNavProps } from './types'

const useStyles = makeStyles((theme: Theme) => {
  const gradientBackground = `radial-gradient(ellipse at top, ${theme.palette.primary.light}, transparent),
radial-gradient(ellipse at bottom, ${theme.palette.primary.dark}, transparent)`

  return createStyles({
    bottomNavRoot: {
      backgroundColor: theme.palette.primary.dark,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      bottom: 0,
      boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
      left: 0,
      position: 'absolute',
      right: 0,
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        boxShadow: '0px -5px 5px 0px rgba(0,0,0,0.1)',
        borderRadius: 0,
        height: BOTTOM_NAV_HEIGHT_MOBILE,
      },
      [theme.breakpoints.up('md')]: {
        left: 24,
        right: 'auto',
        bottom: 36, // above MB logo // TODO: mv logo to right side
        width: panelWidths.mid,
      },
      [theme.breakpoints.up('xl')]: {
        width: panelWidths.midLarge,
      },
    },
    // TODO: clip-path notch instead of boring rounded corners
    root: {
      minWidth: 'auto', // 80 = too-large default,
      // Probably NOT light/dark theme interchangeable:
      outline: `solid 1px hsla(168, 41%, 19%, 0.15)`,
      transition: 'all 300ms ease',
      '&:hover': {
        [theme.breakpoints.up('sm')]: {
          background: theme.palette.primary.main,
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
      fontSize: theme.typography.button.fontSize,
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

// Home, table, help do not have sub-routes
const initialSubRoutes = {
  details: '/details',
  Explore: '/Explore',
} as { [key: string]: RouteLocation }

export const BottomNav: FC<BottomNavProps> = (props) => {
  const { setPanelOpen } = props
  const loc = useLocation()
  const classes = useStyles()
  const { root, selected, label, wrapper } = classes

  const currPathSansSlash = loc.pathname.split('/')[1]
  const handleChange = () => setPanelOpen(true)

  const [subRoutePath, setSubRoutePath] = useState(
    initialSubRoutes as { [key: string]: string }
  )

  useEffect(() => {
    const correspRoute = subRoutePath[currPathSansSlash]

    if (!correspRoute) return

    // TODO: if no change and not top-level, go to top level
    // TODO: if top level already, close panel
    // Route changes should only affect their corresponding item
    setSubRoutePath({
      ...subRoutePath,
      [currPathSansSlash]: loc.pathname,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname])

  return (
    <BottomNavigation
      component="nav"
      value={`${loc.pathname.split('/')[1]}` || '/'}
      onChange={handleChange}
      className={classes.bottomNavRoot}
    >
      {navRoutes.map((config) => {
        const subRouteStateKey = config.rootPath.split('/')[1] || '/'

        return (
          <BottomNavigationAction
            key={config.heading}
            component={NavLink}
            label={config.heading}
            icon={config.icon}
            value={subRouteStateKey}
            to={subRoutePath[subRouteStateKey] || config.rootPath}
            showLabel
            classes={{ root, selected, label, wrapper }}
          />
        )
      })}
    </BottomNavigation>
  )
}
