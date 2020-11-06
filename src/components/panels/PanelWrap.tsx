import React, { FC } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { Paper } from '@material-ui/core'

import { panelsConfig } from './config'
import { useStyles } from './styles'
import { CloseBtn } from './PanelCloseBtn'
import * as Types from './types'
import { Breadcrumbs } from '../sift/Breadcrumbs'

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelWrap: FC<Types.MapPanelProps> = (props) => {
  const { setPanelOpen, panelOpen } = props
  const classes = useStyles({ panelOpen })
  const isExplore = useRouteMatch('/Explore')

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Paper id="map-panels-wrap" className={classes.panelsRoot} elevation={8}>
      {/* TODO: own component, own file */}
      <div
        className={classes.crumbsNcloseWrap}
        style={
          // Panel breadcrumbs wrap BG should be invisible on non-Explore's
          isExplore ? {} : { backgroundColor: 'transparent', boxShadow: 'none' }
        }
      >
        <Route path="/Explore">
          <Breadcrumbs />
        </Route>
        {/* TODO: add maximize btn on mobile */}
        <CloseBtn onClick={() => setPanelOpen(false)} />
      </div>
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
    </Paper>
  )
}
