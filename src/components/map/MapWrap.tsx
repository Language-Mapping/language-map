import React, { FC, useState } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { Map, MapPanel, MapControls } from 'components/map'
import { initialMapState } from 'components/map/config'
import { panelsConfig } from './panelsConfig'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapWrapRoot: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      overflow: 'hidden',
      // TODO: ensure attribution and logo are both clearly visible at all
      // breakpoints. A bit mixed/scattered RN.
      '& .mb-language-map .mapboxgl-ctrl-bottom-left': {
        [theme.breakpoints.down('sm')]: {
          top: 60,
          bottom: 'auto',
        },
      },
    },
    mapItselfWrap: {
      bottom: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    mapPanelsWrap: {
      left: theme.spacing(1),
      right: theme.spacing(1),
      position: 'absolute',
      bottom: 60,
      top: '50%',
      transition: '300ms transform',
      [theme.breakpoints.up('sm')]: {
        width: 425,
        top: 140,
        bottom: theme.spacing(5), // above mapbox logo
        left: 16,
      },
      '& .MuiPaper-root': {
        overflowY: 'auto',
        height: '100%',
      },
    },
    bottomNavRoot: {
      position: 'absolute',
      left: theme.spacing(1),
      right: theme.spacing(1),
      bottom: 0, // nice and flush = more room
      '& svg': {
        height: 20,
        width: 20,
      },
      [theme.breakpoints.up('sm')]: {
        width: 425,
        top: theme.spacing(8),
        left: theme.spacing(2),
        bottom: theme.spacing(1), // above MB logo?
      },
    },
    closePanel: {
      color: theme.palette.common.white,
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 2,
    },
  })
)

export const MapWrap: FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const [panelOpen, setPanelOpen] = useState(true)
  const loc = useLocation()

  const transforms = {
    open: 'translateY(0%)',
    closed: 'translateY(100%)',
  }

  return (
    <div className={classes.mapWrapRoot}>
      <div className={classes.mapItselfWrap}>
        <Map {...initialMapState} />
        <MapControls />
      </div>
      <Box
        // Need the `id` in order to find unique element for `map.setPadding`
        id="map-panels-wrap"
        className={classes.mapPanelsWrap}
        style={{
          transform: panelOpen ? transforms.open : transforms.closed,
          opacity: panelOpen ? 1 : 0,
          maxHeight: panelOpen ? '100%' : 0,
        }}
      >
        {panelOpen && (
          <IconButton
            aria-label="close"
            title="Hide panel"
            size="small"
            className={classes.closePanel}
            onClick={() => setPanelOpen(false)}
          >
            <MdClose />
          </IconButton>
        )}
        <Switch>
          {panelsConfig.map((config) => (
            <Route key={config.heading} path={config.route} exact>
              <MapPanel {...config} active={config.route === loc.pathname} />
            </Route>
          ))}
        </Switch>
      </Box>
      <BottomNavigation
        showLabels
        className={classes.bottomNavRoot}
        value={loc.pathname}
        onChange={(event, newValue) => {
          history.push(newValue + window.location.search)

          // Open the container if closed, close it if already active panel
          if (panelOpen && newValue === loc.pathname) {
            setPanelOpen(false)
          } else {
            setPanelOpen(true)
          }
        }}
      >
        {panelsConfig.map((config) => (
          <BottomNavigationAction
            value={config.route}
            key={config.heading}
            label={config.heading}
            icon={config.icon}
          />
        ))}
      </BottomNavigation>
    </div>
  )
}
