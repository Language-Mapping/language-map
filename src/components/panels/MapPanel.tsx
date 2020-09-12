import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Box } from '@material-ui/core'

import { GlobalContext } from 'components'
import { MapPanelHeader, MapPanelHeaderChild } from './MapPanelHeader'
import { panelsConfig } from './config'
import { useStyles } from './styles'

import * as Types from './types'

type PanelContentComponent = Partial<Types.MapPanelProps> & {
  heading: string
}

// TODO: no need for separate component if render props are used on parent
export const MapPanelContent: FC<PanelContentComponent> = (props) => {
  const { active, children, panelOpen, first } = props
  const classes = useStyles({ active, panelOpen, first })

  return (
    <Box id={first ? 'first' : 'second'} className={classes.panelContent}>
      {children}
    </Box>
  )
}

export const MapPanel: FC<Types.MapPanelProps> = (props) => {
  const { children } = props
  const { state } = useContext(GlobalContext)
  const loc = useLocation()
  const classes = useStyles({ panelOpen: state.panelState === 'default' })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Box id="map-panels-wrap" className={classes.panelsRoot}>
      <MapPanelHeader>
        {[...panelsConfig].map((config) => (
          <MapPanelHeaderChild
            key={config.heading}
            {...config}
            active={loc.pathname === config.path}
          >
            {config.component}
          </MapPanelHeaderChild>
        ))}
      </MapPanelHeader>
      {/* children should just be PanelIntro */}
      {children}
      <div className={classes.contentWrap}>
        {panelsConfig.map((config, i) => (
          <MapPanelContent
            key={config.heading}
            {...config}
            active={loc.pathname === config.path}
            panelOpen={state.panelState === 'default'}
            first={i === 0}
          >
            {config.component}
          </MapPanelContent>
        ))}
      </div>
    </Box>
  )
}
