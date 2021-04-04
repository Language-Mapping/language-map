import React, { FC, useEffect, useRef } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper, Toolbar } from '@material-ui/core'

import { SearchTabs, usePanelState } from 'components/panels'
import {
  BackToTopBtn,
  HideOnScroll,
  ToggleableSection,
  useHideOnScroll,
} from 'components/generic'
import { PanelTitleBar } from './PanelTitleBar'
import { PanelWrapProps } from './types'
import * as config from './config'

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
        width: config.panelWidths.mid,
      },
      [theme.breakpoints.up('xl')]: {
        width: config.panelWidths.midLarge,
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
      top: (props: { hide: boolean; panelOpen: boolean }) =>
        props.hide ? 0 : config.MOBILE_PANEL_HEADER_HT,
      width: '100%',
    },
    innerPanel: {
      padding: '0.75rem 0.75rem',
      [theme.breakpoints.up('sm')]: {
        padding: '1rem 1.25rem',
      },
    },
  })
)

// WISHLIST: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelWrap: FC<PanelWrapProps> = (props) => {
  const { mapRef } = props
  const { panelOpen, searchTabsOpen } = usePanelState()
  const loc = useLocation()
  const { pathname } = loc
  const targetElemID = 'back-to-top-anchor'
  const panelRef = useRef<HTMLDivElement | null>(null)
  const hide = useHideOnScroll(panelRef.current, 125)
  const classes = useStyles({ panelOpen, hide })

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore // TODO: 😞
  const isPageWithID = useRouteMatch<{ params: { id: number } }>([
    '/Explore/Language/:langName/:id',
    '/table/:id',
    // @ts-ignore // TODO: 😞
  ])?.params.id
  const asArray = pathname.split('/')
  const pageTitle = asArray[4] || asArray[3] || asArray[2] || asArray[1]

  // TODO: make this actually work on mobile, and confirm on desktop
  useEffect(() => {
    // @ts-ignore
    document?.activeElement?.blur() // CRED: stackoverflow.com/a/2568972/1048518
  }, [loc.pathname])
  /* eslint-enable @typescript-eslint/ban-ts-comment */

  // Default Home title // TODO: set this for reuse somewhere if needed
  if (!pageTitle) document.title = 'Languages of New York City'
  // Everything else gets the first available path segment, except for detail
  // view via Details or Table.
  else if (!isPageWithID) {
    // CRED: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    const pageTitleCapitalized =
      pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

    document.title = `${pageTitleCapitalized} - NYC Languages`
  }

  return (
    <Paper className={classes.root} elevation={8}>
      <HideOnScroll panelRefElem={panelRef.current}>
        <PanelTitleBar />
      </HideOnScroll>
      <Toolbar variant="dense" />
      <TransitionGroup>
        <CSSTransition key={loc.key} classNames="fade" timeout={950} appear>
          <div className={classes.panelContentRoot} ref={panelRef}>
            <div id={targetElemID} />
            <Switch>
              {/* Always show Search tabs on Home */}
              <Route path="/" exact>
                <SearchTabs mapRef={mapRef} />
              </Route>
              <Route path="/Explore">
                <ToggleableSection show={searchTabsOpen}>
                  <SearchTabs mapRef={mapRef} />
                </ToggleableSection>
              </Route>
            </Switch>
            <div className={classes.innerPanel}>
              <Switch location={loc}>
                {config.nonNavRoutesConfig.map((routeConfig) => {
                  const { exact, rootPath, component } = routeConfig

                  return (
                    <Route exact={exact} path={rootPath} key={rootPath}>
                      {component}
                    </Route>
                  )
                })}
              </Switch>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
      <BackToTopBtn hide={hide} targetElemID={targetElemID} />
    </Paper>
  )
}
