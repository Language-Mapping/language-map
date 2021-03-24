import React, { FC, useEffect } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import { SearchTabs, usePanelState } from 'components/panels'
import {
  panelWidths,
  nonNavRoutesConfig,
  MOBILE_PANEL_HEADER_HT,
} from './config'
import { PanelTitleBar } from './PanelTitleBar'
import { PanelWrapProps } from './types'

import './styles.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottomLeftRadius: 0, // override paper
      borderBottomRightRadius: 0, // override paper
      bottom: 48, // default is set directly in MUI to 56
      boxShadow: '0 -2px 7px hsla(0, 0%, 0%, 0.25)',
      left: 0,
      opacity: (props: { panelOpen: boolean }) => (props.panelOpen ? 1 : 0),
      position: 'absolute',
      right: 0,
      top: '45%',
      transition: '300ms ease all',
      transform: (props: { panelOpen: boolean }) =>
        `translateY(${props.panelOpen ? 0 : '100%'})`,
      [theme.breakpoints.up('sm')]: {
        left: 8,
        right: 8,
      },
      [theme.breakpoints.up('md')]: {
        top: 24,
        left: 24,
        bottom: 92, // 36 + 56 (aka BottomNav `bottom` + `height`)
        width: panelWidths.mid,
      },
      [theme.breakpoints.up('xl')]: {
        width: panelWidths.midLarge,
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
      },
    },
    panelContentRoot: {
      bottom: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'absolute',
      top: MOBILE_PANEL_HEADER_HT,
      width: '100%',
    },
    innerPanel: {
      padding: '0.75rem 0.75rem 0',
      [theme.breakpoints.up('sm')]: {
        padding: '1.5rem 1.25rem',
      },
    },
  })
)

// WISHLIST: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelWrap: FC<PanelWrapProps> = (props) => {
  const { mapRef } = props
  const { panelOpen } = usePanelState()
  const classes = useStyles({ panelOpen })
  const loc = useLocation()
  const { pathname } = loc
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: 😞
  const isPageWithID = useRouteMatch(['/details/:id', '/table/:id'])?.params.id
  const asArray = pathname.split('/')
  const pageTitle = asArray[4] || asArray[3] || asArray[2] || asArray[1]

  // TODO: set this for reuse somewhere if needed
  if (!pageTitle) document.title = 'Languages of New York City'
  // just Home
  // Everything else gets the first available path segment, except for detail
  // view via Details or Table.
  else if (!isPageWithID) {
    // CRED: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    const pageTitleCapitalized =
      pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

    document.title = `${pageTitleCapitalized} - NYC Languages`
  }

  // TODO: make this actually work on mobile, and confirm on desktop
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document?.activeElement?.blur() // CRED: stackoverflow.com/a/2568972/1048518
  }, [loc])

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Paper id="map-panels-wrap" className={classes.root} elevation={8}>
      <div id="back-to-top-anchor" />
      <PanelTitleBar>
        <SearchTabs mapRef={mapRef} />
      </PanelTitleBar>
      <TransitionGroup>
        <CSSTransition key={loc.key} classNames="fade" timeout={950} appear>
          <div className={classes.panelContentRoot}>
            <Route path="/" exact>
              <SearchTabs mapRef={mapRef} />
            </Route>
            <div className={classes.innerPanel}>
              <Switch location={loc}>
                {nonNavRoutesConfig.map((config) => (
                  <Route
                    exact={config.exact}
                    path={config.rootPath}
                    key={config.rootPath}
                  >
                    {config.component}
                  </Route>
                ))}
              </Switch>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Paper>
  )
}
