import React, { FC, useEffect, useRef, useState, useCallback } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { SearchTabs, usePanelState } from 'components/panels'
import { BackToTopBtn } from 'components/generic'
import { routes } from 'components/config/api'
import { BottomNav } from 'components/nav'
import { BOTTOM_NAV_HEIGHT_MOBILE } from 'components/nav/config'
import { PanelTitleBar } from './PanelTitleBar'
import { PanelWrapProps } from './types'

import {
  panelWidths,
  MOBILE_PANEL_HEADER_HT,
  nonNavRoutesConfig,
} from './config'
import './styles.css'

type StyleProps = {
  hide: boolean
  panelOpen: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: '2px 0 7px hsla(0, 0%, 0%, 0.25)',
      opacity: (props: StyleProps) => (props.panelOpen ? 1 : 0),
      width: '100%',
      transition: '300ms ease all',
      display: 'grid',
      position: 'relative',
      gridTemplateRows: 'auto 1fr auto',
      [theme.breakpoints.up('sm')]: {
        transform: (props: StyleProps) =>
          `translateX(${props.panelOpen ? 0 : '-100%'})`,
        maxWidth: (props: StyleProps) =>
          props.panelOpen ? panelWidths.mid : 0,
        flexBasis: (props: StyleProps) =>
          props.panelOpen ? panelWidths.mid : 0,
        flexGrow: 1,
        flexShrink: 0,
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: (props: StyleProps) =>
          props.panelOpen ? panelWidths.midLarge : 0,
        flexBasis: (props: StyleProps) =>
          props.panelOpen ? panelWidths.midLarge : 0,
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
      },
    },
    panelContentRoot: {
      overflowX: 'hidden',
      width: '100%',
      position: 'absolute',
      top: MOBILE_PANEL_HEADER_HT,
      bottom: BOTTOM_NAV_HEIGHT_MOBILE,
      overflowY: 'auto',
    },
    innerPanel: {
      padding: '0.75rem 0.75rem',
      [theme.breakpoints.up('sm')]: {
        padding: '1.25rem',
      },
    },
  })
)

// TODO: into utils
function getScrollY(scroller: HTMLElement): number {
  if (!scroller) return window.pageYOffset
  if (scroller.scrollTop !== undefined) return scroller.scrollTop

  return (document.documentElement || document.body.parentNode || document.body)
    .scrollTop
}

// WISHLIST: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelWrap: FC<PanelWrapProps> = (props) => {
  const { mapRef } = props
  const { panelOpen, searchTabsOpen } = usePanelState()
  const loc = useLocation()
  const { pathname, hash } = loc
  const targetElemID = 'back-to-top-anchor'
  const [hide, setHide] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const classes = useStyles({ panelOpen, hide })

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore // TODO: 😞
  const isPageWithID = useRouteMatch<{ params: { id: number } }>([
    '/Explore/Language/:langName/:id',
    routes.dataDetail,
    // @ts-ignore // TODO: 😞
  ])?.params.id
  const asArray = pathname.split('/')
  const pageTitle = asArray[4] || asArray[3] || asArray[2] || asArray[1]
  const scrollRef = useRef<number>(0)
  const threshold = 125

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement, UIEvent>) => {
      if (!panelRef.current) return

      let shouldHide = false
      const scrollY = getScrollY(panelRef.current)
      const prevScrollY = scrollRef.current

      scrollRef.current = scrollY

      if (scrollY > prevScrollY && scrollY > threshold) {
        shouldHide = true
      }

      setHide(shouldHide)
    },
    [panelRef]
  )

  // Show on each pathname change, otherwise it stays hidden
  useEffect(() => {
    setHide(false)
  }, [pathname])

  useEffect(() => {
    if (!hash) return

    setHide(true)
  }, [hash]) // hash makes it work for Help and About anchors

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
    <div className={classes.root}>
      <PanelTitleBar />
      <TransitionGroup>
        <CSSTransition key={loc.key} classNames="fade" timeout={950} appear>
          <div
            className={classes.panelContentRoot}
            onScroll={handleScroll}
            ref={panelRef}
          >
            <div id={targetElemID} />
            <Switch>
              {/* Always show Search tabs on Home */}
              <Route path="/" exact>
                <SearchTabs mapRef={mapRef} />
              </Route>
              <Route path="/Explore">
                <SearchTabs mapRef={mapRef} fixed open={searchTabsOpen} />
              </Route>
            </Switch>
            <div className={classes.innerPanel}>
              <Switch location={loc}>
                {nonNavRoutesConfig.map((routeConfig) => {
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
      <BottomNav />
    </div>
  )
}
