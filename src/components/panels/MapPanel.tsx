import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Paper } from '@material-ui/core'

import {
  DESKTOP_PANEL_HEADER_HEIGHT,
  MOBILE_PANEL_HEADER_HEIGHT,
  panelWidths,
} from 'components/map/styles'
import { GlobalContext } from 'components'
import { MapPanelHeader, MapPanelHeaderChild } from 'components/panels'
import { DetailsIntro } from 'components/details'
import { panelsConfig } from '../../config/panels-config'

type MapPanelProps = {
  active?: boolean
  panelOpen?: boolean
  screenHeight?: number
}

type PanelContentComponent = Partial<MapPanelProps> & {
  heading: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPanelsWrap: {
      bottom: 0,
      left: theme.spacing(1),
      position: 'absolute',
      right: theme.spacing(1),
      transition: '300ms transform',
      '& .MuiPaper-root': {
        height: '100%',
        overflowY: 'auto',
      },
      transform: (props: MapPanelProps) => {
        if (!props.panelOpen) {
          return `translateY(calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT}))`
        }

        return 'translateY(0)'
      },
      [theme.breakpoints.up('md')]: {
        bottom: theme.spacing(3),
        left: theme.spacing(3),
        top: `${theme.spacing(3)}px !important`, // INSANITY
        width: panelWidths.mid,
        transform: (props: MapPanelProps) => {
          if (!props.panelOpen) {
            return `translateY(calc(100% - ${DESKTOP_PANEL_HEADER_HEIGHT}))`
          }

          return 'translateY(0)'
        },
      },
      top: (props: MapPanelProps) =>
        props.screenHeight ? `${props.screenHeight / 2}px` : 'auto',
      [theme.breakpoints.up('lg')]: {
        width: panelWidths.midLarge,
      },
    },
    panelRoot: {
      // YES. We really have to go this high up. Tests fail with errors like:
      // Material-UI: The key `omniboxLabel` provided to the classes prop is not
      // implemented in ForwardRef(Autocomplete).
      '& .MuiInputLabel-formControl': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
      },
    },
    contentWrap: {
      padding: '1rem 0',
      display: 'flex',
      flexDirection: 'column',
    },
    panelContent: {
      paddingLeft: '0.8rem',
      paddingRight: '0.8rem',
      transition: '300ms opacity',
      opacity: (props: MapPanelProps) =>
        props.active && props.panelOpen ? 1 : 0,
      transform: (props: MapPanelProps) =>
        props.active && props.panelOpen ? 'scaleY(1)' : 'scaleY(0)',
      maxHeight: (props: MapPanelProps) =>
        props.active && props.panelOpen ? '100%' : 0,
      [theme.breakpoints.up('lg')]: {
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
      },
    },
  })
)

// TODO: no need for separate component if render props are used on parent
export const MapPanelContent: FC<PanelContentComponent> = (props) => {
  const { active, children, panelOpen } = props
  const classes = useStyles({ active, panelOpen })

  return <Box className={classes.panelContent}>{children}</Box>
}

export const MapPanel: FC<MapPanelProps> = (props) => {
  const { state } = useContext(GlobalContext)
  const loc = useLocation()
  const { screenHeight } = props
  const classes = useStyles({
    screenHeight,
    panelOpen: state.panelState === 'default',
  })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Box id="map-panels-wrap" className={classes.mapPanelsWrap}>
      <Paper className={classes.panelRoot} elevation={14}>
        <MapPanelHeader>
          {/* Gross but "/" route needs to come last */}
          {[...panelsConfig].reverse().map((config) => (
            <MapPanelHeaderChild
              key={config.heading}
              {...config}
              active={loc.pathname === config.path}
            >
              {config.component}
            </MapPanelHeaderChild>
          ))}
        </MapPanelHeader>
        <DetailsIntro />
        <div className={classes.contentWrap}>
          {panelsConfig.map((config) => (
            <MapPanelContent
              key={config.heading}
              {...config}
              active={loc.pathname === config.path}
              panelOpen={state.panelState === 'default'}
            >
              {config.component}
            </MapPanelContent>
          ))}
        </div>
      </Paper>
    </Box>
  )
}
