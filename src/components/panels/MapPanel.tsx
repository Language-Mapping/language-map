import React, { FC, useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Box } from '@material-ui/core'

import { GlobalContext } from 'components'
import { PanelIntro } from 'components/panels'
import { MapPanelHeader, MapPanelHeaderChild } from './MapPanelHeader'
import { panelsConfig } from './config'
import { useStyles } from './styles'

import * as Types from './types'

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
// TODO: git mv into Panels.tsx
export const Panel: FC<Types.MapPanelProps> = (props) => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles({ panelOpen: state.panelState === 'default' })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <>
      <Box id="map-panels-wrap" className={classes.panelsRoot}>
        <div>
          <MapPanelHeader>
            {panelsConfig.map((config) => (
              <MapPanelHeaderChild key={config.heading} {...config}>
                {config.component}
              </MapPanelHeaderChild>
            ))}
          </MapPanelHeader>
          <PanelIntro />
        </div>
        <div className={classes.contentWrap}>
          <Switch>
            {/* Reverse because home needs to match last */}
            {[...panelsConfig].reverse().map((config) => (
              <Route path={config.rootPath} key={config.heading}>
                {config.component}
              </Route>
            ))}
          </Switch>
        </div>
      </Box>
    </>
  )
}
