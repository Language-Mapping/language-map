import React, { FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Hidden,
} from '@material-ui/core'

import { panelsConfig, panelWidths } from '../panels/config'

type MiniDrawerProps = {
  panelOpen: boolean
  setPanelOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomNavRoot: {
      position: 'fixed',
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
    bottomNavAction: {
      minWidth: 'auto', // 80 = too-large default,
      // color: 'inherit',
    },
  })
)

export const BottomNav: FC<MiniDrawerProps> = (props) => {
  const { panelOpen, setPanelOpen } = props
  const classes = useStyles()
  const loc = useLocation()

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    if (!panelOpen) {
      setPanelOpen(true)
    } else if (newValue === loc.pathname) {
      setPanelOpen(false)
    }
  }

  const navItems = panelsConfig.map((config) => (
    <BottomNavigationAction
      component={NavLink}
      to={config.rootPath}
      exact={config.exact}
      key={config.heading}
      label={config.heading}
      value={config.rootPath}
      icon={config.icon}
      classes={{
        root: classes.bottomNavAction,
      }}
    />
  ))

  return (
    <div className={classes.bottomNavRoot}>
      <Hidden smUp>
        {/* @ts-ignore */}
        <BottomNavigation
          value={loc.pathname}
          onChange={handleChange}
          showLabels
          // TODO: elevation, rounded corners. Do we even need two components?
        >
          {navItems}
        </BottomNavigation>
      </Hidden>
      <Hidden smDown>
        {/* @ts-ignore */}
        <BottomNavigation
          component={Paper}
          elevation={6}
          value={loc.pathname}
          onChange={handleChange}
          square
          showLabels
        >
          {navItems}
        </BottomNavigation>
      </Hidden>
    </div>
  )
}
