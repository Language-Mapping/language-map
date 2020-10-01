import React, { FC, useContext } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Box } from '@material-ui/core'

import { GlobalContext } from 'components'
import { MapPanelHeader, MapPanelHeaderChild } from './MapPanelHeader'
import { panelsConfig } from './config'
import { useStyles } from './styles'

import * as Types from './types'

export const Panel: FC<Types.MapPanelProps> = (props) => {
  const { children } = props
  const { state } = useContext(GlobalContext)
  const loc = useLocation()
  const classes = useStyles({ panelOpen: state.panelState === 'default' })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <>
      <Box id="map-panels-wrap" className={classes.panelsRoot}>
        <div>
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
          {children}
        </div>
        <div className={classes.contentWrap}>
          <Switch>
            {panelsConfig.map((config) => (
              <Route exact path={config.path} key={config.heading}>
                {config.component}
              </Route>
            ))}
          </Switch>
        </div>
      </Box>
    </>
  )
}
