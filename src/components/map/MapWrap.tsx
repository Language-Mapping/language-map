import React, { FC, useState } from 'react'
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
      // GROSS:
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
        width: 325,
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
      bottom: theme.spacing(1),
      '& svg': {
        height: 20,
        width: 20,
      },
      [theme.breakpoints.up('sm')]: {
        width: 325,
        top: theme.spacing(8),
        left: theme.spacing(2),
      },
    },
    closePanel: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      zIndex: 2,
    },
  })
)

export const MapWrap: FC = () => {
  const classes = useStyles()
  const [panelOpen, setPanelOpen] = useState(true)
  // TODO: wire this up with routing, at least for sel. feat details.
  const [activePanelIndex, setActivePanelIndex] = useState(0)
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
        className={classes.mapPanelsWrap}
        style={{
          transform: panelOpen ? transforms.open : transforms.closed,
          opacity: panelOpen ? 1 : 0,
          maxHeight: panelOpen ? '100%' : 0,
        }}
      >
        <IconButton
          aria-label="delete"
          size="small"
          className={classes.closePanel}
          onClick={() => setPanelOpen(false)}
        >
          <MdClose />
        </IconButton>
        {panelsConfig.map((config, i) => (
          <MapPanel
            key={config.heading}
            {...config}
            active={i === activePanelIndex}
          />
        ))}
      </Box>
      <BottomNavigation
        showLabels
        className={classes.bottomNavRoot}
        value={activePanelIndex}
        onChange={(event, newValue) => {
          if (panelOpen && newValue === activePanelIndex) {
            setPanelOpen(false)
          } else {
            setPanelOpen(true)
          }

          setActivePanelIndex(newValue)
        }}
      >
        {panelsConfig.map((config) => (
          <BottomNavigationAction
            key={config.heading}
            label={config.heading}
            icon={config.icon}
          />
        ))}
      </BottomNavigation>
    </div>
  )
}
