import React, { FC, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'

import { RouteLocation } from 'components/config/types'
import { navRoutes, panelWidths } from '../panels/config'
import { BOTTOM_NAV_HEIGHT_MOBILE } from './config'
import { BottomNavProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
    bottomNavAction: {
      borderBottomColor: 'transparent',
      borderBottomStyle: 'solid',
      borderBottomWidth: 0,
      color: theme.palette.text.secondary,
      minWidth: 'auto', // 80 = too-large default,
      outline: `solid 1px hsla(168, 41%, 19%, 0.15)`,
      transition: 'all 300ms ease',
      [theme.breakpoints.down('sm')]: {
        padding: '0 !important',
      },
      '& svg': {
        transition: '300ms ease all',
        fontSize: '1.4em',
      },
    },
    bottomNavIconOnly: {
      paddingTop: 24,
    },
    bottomNavLabel: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    bottomNavSelected: {
      color: theme.palette.text.primary,
      borderBottomWidth: 4,
      borderBottomColor: theme.palette.primary.main,
      fontSize: '0.85em',
      '& svg': {
        fill: theme.palette.text.primary,
        fontSize: '1.2em',
      },
    },
  })
)

// Home, table, help do not have sub-routes
const initialSubRoutes = {
  details: '/details',
  Explore: '/Explore',
} as { [key: string]: RouteLocation }

export const BottomNav: FC<BottomNavProps> = (props) => {
  const { setPanelOpen } = props
  const classes = useStyles()
  const loc = useLocation()
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
      className={classes.root}
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
            classes={{
              selected: classes.bottomNavSelected,
              root: classes.bottomNavAction,
              label: classes.bottomNavLabel,
            }}
          />
        )
      })}
    </BottomNavigation>
  )
}
