import React, { FC, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core'

import { RouteLocation } from 'components/config/types'
import { panelsConfig, panelWidths } from '../panels/config'

type BottomNav = {
  setPanelOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomNavRoot: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      '& svg': {
        fontSize: '1.2em',
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
    bottomNav: {
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      [theme.breakpoints.down('sm')]: {
        borderRadius: 0,
      },
    },
    bottomNavAction: {
      minWidth: 'auto', // 80 = too-large default,
    },
  })
)

// Home, table, help do not have sub-routes
const initialSubRoutes = {
  details: '/details',
  Explore: '/Explore',
} as { [key: string]: RouteLocation }

export const BottomNav: FC<BottomNav> = (props) => {
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
    <div className={classes.bottomNavRoot}>
      <BottomNavigation
        component={Paper}
        elevation={8}
        value={`${loc.pathname.split('/')[1]}` || '/'}
        onChange={handleChange}
        className={classes.bottomNav}
      >
        {panelsConfig
          .filter(({ rootPath }) => !rootPath.includes('/:')) // omit sub-routes
          .map((config) => {
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
                  root: classes.bottomNavAction,
                }}
              />
            )
          })}
      </BottomNavigation>
    </div>
  )
}
