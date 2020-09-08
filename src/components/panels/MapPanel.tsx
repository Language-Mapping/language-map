/* eslint-disable operator-linebreak */
import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

import { GlobalContext } from 'components'
import { panelWidths, MOBILE_PANEL_HEADER_HEIGHT } from 'components/map/styles'
import { MapPanelHeader, MapPanelHeaderChild } from './MapPanelHeader'
import { PanelIntro } from './PanelIntro'
import { panelsConfig } from './config'

type MapPanelProps = {
  active?: boolean
  panelOpen?: boolean
}

type PanelContentComponent = Partial<MapPanelProps> & {
  heading: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelsRoot: {
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.easing.easeInOut,
      [theme.breakpoints.down('sm')]: {
        order: 2,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 calc(50% - ${MOBILE_PANEL_HEADER_HEIGHT})` : 0,
        maxHeight: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? '50%' : MOBILE_PANEL_HEADER_HEIGHT,
        transform: ({ panelOpen }: MapPanelProps) =>
          panelOpen
            ? 'translateY(0%)'
            : `translateY(calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT}))`,
      },
      // [theme.breakpoints.up('sm')]: { order: 1 },
      [theme.breakpoints.up('md')]: {
        opacity: ({ panelOpen }: MapPanelProps) => (panelOpen ? 1 : 0),
        transform: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? 'translateX(0%)' : `translateX(-${panelWidths.mid}px)`,
        maxWidth: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? panelWidths.mid : 0,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 ${panelWidths.mid}px` : 0,
      },
      [theme.breakpoints.up('xl')]: {
        transform: ({ panelOpen }: MapPanelProps) =>
          panelOpen
            ? 'translateX(0%)'
            : `translateX(-${panelWidths.midLarge}px)`,
        maxWidth: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? panelWidths.midLarge : 0,
        flex: ({ panelOpen }: MapPanelProps) =>
          panelOpen ? `1 0 ${panelWidths.midLarge}px` : 0,
      },
      '& .MuiPaper-root': { height: '100%', overflowY: 'auto' },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
      },
    },
    contentWrap: { overflowY: 'auto', paddingBottom: '1rem' },
    panelContent: {
      paddingLeft: '0.8rem',
      paddingRight: '0.8rem',
      // TODO: look into everything here down...
      transition: '300ms opacity',
      opacity: (props: MapPanelProps) => (props.active ? 1 : 0),
      // props.active && props.panelOpen ? 1 : 0, // DO THESE MATTER?
      transform: (props: MapPanelProps) =>
        props.active ? 'scaleY(1)' : 'scaleY(0)',
      // TODO: replace this with a left/right transform!
      maxHeight: (props: MapPanelProps) => (props.active ? '100%' : 0),
      [theme.breakpoints.up('sm')]: {
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
  const classes = useStyles({ panelOpen: state.panelState === 'default' })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Box id="map-panels-wrap" className={classes.panelsRoot}>
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
      <div className={classes.contentWrap}>
        <PanelIntro />
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
    </Box>
  )
}
