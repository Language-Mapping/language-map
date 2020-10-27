import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Paper, Hidden } from '@material-ui/core'

import { panelsConfig } from './config'
import { useStyles } from './styles'
import { CloseBtnPill, CloseBtn } from './PanelCloseBtn'
import * as Types from './types'

// TODO: rm if can't get working
// CRED: https://stackoverflow.com/a/4819886/1048518
// function isTouchDevice() {
//   if (!window) return false

//   if ('ontouchstart' in window || window.TouchEvent) return true

//   // @ts-ignore
//   if (window.DocumentTouch && document instanceof DocumentTouch) return true

//   const prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-']
//   const queries = prefixes.map((prefix) => `(${prefix}touch-enabled)`)

//   return window.matchMedia(queries.join(',')).matches
// }

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
        <Hidden smUp>
          <CloseBtnPill onClick={() => closePanel()} />
        </Hidden>
        <Hidden smDown>
          <CloseBtn onClick={() => closePanel()} />
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
