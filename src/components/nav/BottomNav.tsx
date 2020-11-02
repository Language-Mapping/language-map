import React, { FC, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core'

import { MapPanel } from 'components/panels/types'
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

// Just a BottomNavigationAction component that needs its own state so that
// routing changes update the "to" accordingly, allowing user to return to the
// last view they were at for each panel.
export const BottomNavItem: FC<MapPanel> = (props) => {
  const { rootPath, heading, icon } = props
  const classes = useStyles()
  const loc = useLocation()
  const currentPathname = loc.pathname
  const [to, setTo] = useState(rootPath as string)

  useEffect(() => {
    // Home, table, help do not have sub-routes
    const routesWithSubroutes: RouteLocation[] = ['/details', '/Explore']
    if (!routesWithSubroutes.includes(rootPath)) return

    const topLevelRoute = rootPath.split('/')[1]
    const currPathSansSlash = currentPathname.split('/')[1]
    const shouldAffectNewRoute = topLevelRoute === currPathSansSlash

    // Route changes should only affect their corresponding item
    if (!shouldAffectNewRoute) return

    setTo(currentPathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPathname])

  return (
    <BottomNavigationAction
      component={NavLink}
      to={to}
      label={heading} // uhhh, donde?
      value={to}
      icon={icon}
      classes={{
        root: classes.bottomNavAction,
      }}
    />
  )
}

export const BottomNav: FC<BottomNav> = (props) => {
  const { setPanelOpen } = props
  const classes = useStyles()
  const loc = useLocation()
  const handleChange = () => setPanelOpen(true)

  return (
    <div className={classes.bottomNavRoot}>
      <BottomNavigation
        component={Paper}
        elevation={8}
        value={loc.pathname}
        onChange={handleChange}
        className={classes.bottomNav}
        showLabels
      >
        {panelsConfig
          .filter(({ rootPath }) => !rootPath.includes('/:')) // omit sub-routes
          .map((config) => (
            <BottomNavItem key={config.heading} {...config} />
          ))}
      </BottomNavigation>
    </div>
  )
}
