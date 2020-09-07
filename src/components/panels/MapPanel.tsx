import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

import { GlobalContext } from 'components'
import { MapPanelHeader, MapPanelHeaderChild } from 'components/panels'
import { DetailsIntro } from 'components/details'
import { panelsConfig } from '../../config/panels-config'

type MapPanelProps = {
  active?: boolean
  panelOpen?: boolean
}

type PanelContentComponent = Partial<MapPanelProps> & {
  heading: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPanelsWrap: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      transition: '300ms flex-basis',
      width: '100%',
      [theme.breakpoints.up('md')]: { width: 450 },
      [theme.breakpoints.up('xl')]: { width: 600 },
      [theme.breakpoints.down('sm')]: {
        flexBasis: ({ panelOpen }) => (panelOpen ? '50%' : 60),
        order: 2,
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
      opacity: (props: MapPanelProps) =>
        props.active && props.panelOpen ? 1 : 0,
      transform: (props: MapPanelProps) =>
        props.active && props.panelOpen ? 'scaleY(1)' : 'scaleY(0)',
      maxHeight: (props: MapPanelProps) =>
        props.active && props.panelOpen ? '100%' : 0,
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
    <Box id="map-panels-wrap" className={classes.mapPanelsWrap}>
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
        <DetailsIntro />
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
