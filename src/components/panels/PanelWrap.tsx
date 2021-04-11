import React, { FC, useEffect, useRef } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Hidden } from '@material-ui/core'

import {
  SearchTabs,
  usePanelState,
  PanelCloseBtnSticky,
} from 'components/panels'
import { BackToTopBtn, useHideOnScroll } from 'components/generic'
import { routes } from 'components/config/api'
import { BottomNav } from 'components/nav'
import { PanelTitleBar } from './PanelTitleBar'
import { PanelWrapProps } from './types'

import { panelWidths, nonNavRoutesConfig } from './config'
import './styles.css'

type Style = {
  open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: '1px 2px 8px hsl(0deg 0% 0% / 65%)',
      opacity: (props: Style) => (props.open ? 1 : 0),
      transition: '300ms ease all',
      [theme.breakpoints.up('md')]: {
        position: 'relative', // NOT SURE TRY ON DESK
        maxWidth: (props: Style) => (props.open ? panelWidths.mid : 0),
        flexBasis: (props: Style) => (props.open ? panelWidths.mid : 0),
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: (props: Style) => (props.open ? panelWidths.midLarge : 0),
        flexBasis: (props: Style) => (props.open ? panelWidths.midLarge : 0),
      },
      [theme.breakpoints.down('sm')]: {
        // Prevent extra gap on phone/tablet:
        // borderTopWidth: (props: Style) => (props.open ? 3 : 0),
        // borderTopColor: theme.palette.primary.dark,
        // borderTopStyle: `solid`,
        order: 2,
        display: 'block',
        maxHeight: '40vh',
        flex: 1,
      },
      [theme.breakpoints.only('sm')]: {
        maxHeight: (props: Style) => (props.open ? '45vh' : 0),
        minHeight: (props: Style) => (props.open ? '45vh' : 0),
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
      },
      '& .trans-group': {
        height: '100%',
        [theme.breakpoints.up('md')]: {
          position: 'relative',
        },
      },
    },
    panelContent: {
      opacity: 1,
      overflowY: 'auto',
      padding: '1rem 0.75rem 1.25rem',
      width: '100%',
      [theme.breakpoints.up('md')]: {
        padding: '1.5rem 1.25rem',
        position: 'absolute',
        top: 48,
        bottom: 48,
        width: '100%',
      },
      [theme.breakpoints.only('sm')]: {
        margin: '1rem auto',
        maxWidth: 675, // slightly fragile but makes for 3x cards per row
      },
      [theme.breakpoints.up('xl')]: {
        padding: '1.75rem 1.5rem',
      },
      [theme.breakpoints.down('sm')]: {
        height: '100%',
        padding: '1rem 0.75rem 1.25rem',
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
  const hide = useHideOnScroll(panelRef.current)
  const classes = useStyles({ open: panelOpen })

  // React.useEffect(() => { window.scrollTo(0, 1) }, []) // TODO: try

  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore // TODO: 😞
  const isPageWithID = useRouteMatch<{ params: { id: number } }>([
    '/Explore/Language/:langName/:id',
    routes.dataDetail,
    // @ts-ignore // TODO: 😞
  ])?.params.id
  const asArray = pathname.split('/')
  const pageTitle = asArray[4] || asArray[3] || asArray[2] || asArray[1]

  // TODO: make this actually work on mobile, and confirm on desktop
  useEffect(() => {
    // @ts-ignore
    document?.activeElement?.blur() // CRED: stackoverflow.com/a/2568972/1048518
  }, [pathname])
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
      <Hidden smDown>
        <PanelTitleBar />
      </Hidden>
      <Hidden mdUp>
        <PanelCloseBtnSticky />
      </Hidden>
      <TransitionGroup className="trans-group">
        <CSSTransition key={loc.key} classNames="fade" timeout={950}>
          <div className={classes.panelContent} ref={panelRef}>
            <div id={targetElemID} />
            <Route path="/" exact>
              <div style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
                <SearchTabs mapRef={mapRef} />
              </div>
            </Route>
            <Route path="/Explore">
              <SearchTabs mapRef={mapRef} fixed open={searchTabsOpen} />
            </Route>
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
        </CSSTransition>
      </TransitionGroup>
      <BackToTopBtn hide={hide} targetElemID={targetElemID} />
      <Hidden smDown>
        <BottomNav />
      </Hidden>
    </div>
  )
}
