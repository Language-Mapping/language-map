import React, { FC } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { Paper } from '@material-ui/core'

import { panelsConfig } from './config'
import { useStyles } from './styles'
import { CloseBtn } from './PanelCloseBtn'
import * as Types from './types'
import { Breadcrumbs } from '../sift/Breadcrumbs'
import { toProperCase } from '../../utils'

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelWrap: FC<Types.MapPanelProps> = (props) => {
  const { setPanelOpen, panelOpen } = props
  const classes = useStyles({ panelOpen })
  const { pathname } = useLocation()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: 😞
  const isPageWithID = useRouteMatch(['/details/:id', '/table/:id'])?.params.id
  const asArray = pathname.split('/')
  const pageTitle = asArray[4] || asArray[3] || asArray[2] || asArray[1]

  // Home gets default title
  if (!pageTitle) document.title = 'Languages of New York City'
  // Everything else gets the first available path segment, except for detail
  // view via Details or Table.
  else if (!isPageWithID)
    document.title = `${toProperCase(pageTitle)} - NYC Languages`

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Paper id="map-panels-wrap" className={classes.root} elevation={8}>
      {/* TODO: own component, own file */}
      <div className={classes.crumbsNcloseWrap}>
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
