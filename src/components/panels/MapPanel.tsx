import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Paper, IconButton } from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { panelsConfig } from './config'
import { useStyles } from './styles'
import * as Types from './types'

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
// TODO: git mv into Panels.tsx
export const MapPanel: FC<Types.MapPanelProps> = (props) => {
  const { closePanel, panelOpen } = props
  const classes = useStyles({ panelOpen })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Paper id="map-panels-wrap" className={classes.panelsRoot} elevation={8}>
      <div className={classes.contentWrap}>
        <IconButton
          onClick={closePanel}
          className={classes.closeBtn}
          size="small"
          edge="end"
        >
          <MdClose />
        </IconButton>
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
