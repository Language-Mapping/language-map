import React, { FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core'

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

export const BottomNav: FC<BottomNav> = (props) => {
  const { setPanelOpen } = props
  const classes = useStyles()
  const loc = useLocation()
  const handleChange = () => setPanelOpen(true)

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
      {/* @ts-ignore not sure why needed, this is totally valid */}
      <BottomNavigation
        component={Paper}
        elevation={8}
        value={loc.pathname}
        onChange={handleChange}
        className={classes.bottomNav}
        showLabels
      >
        {navItems}
      </BottomNavigation>
    </div>
  )
}
