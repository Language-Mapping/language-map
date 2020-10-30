import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Paper, Hidden } from '@material-ui/core'

import { panelsConfig } from './config'
import { useStyles } from './styles'
import { CloseBtnPill } from './PanelCloseBtn'
import * as Types from './types'

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
// TODO: git mv into Panels.tsx
export const MapPanel: FC<Types.MapPanelProps> = (props) => {
  const { setPanelOpen, panelOpen } = props
  const classes = useStyles({ panelOpen })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Paper id="map-panels-wrap" className={classes.panelsRoot} elevation={8}>
      <div className={classes.contentWrap}>
        <Hidden smUp>
          <CloseBtnPill onClick={() => setPanelOpen(false)} />
        </Hidden>
        <Switch>
          {panelsConfig.map((config) => (
            <Route
              exact={config.exact}
              path={config.rootPath}
              key={config.heading}
            >
              {config.component}
            </Route>
          ))}
        </Switch>
      </div>
    </Paper>
  )
}
