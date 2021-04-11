import React, { FC, useEffect, useRef } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Hidden } from '@material-ui/core'

import { SearchTabs, usePanelState } from 'components/panels'
import { BackToTopBtn, useHideOnScroll } from 'components/generic'
import { routes } from 'components/config/api'
import { BottomNav } from 'components/nav'
import { PanelTitleBar } from './PanelTitleBar'
import { PanelWrapProps } from './types'

import { panelWidths, nonNavRoutesConfig } from './config'
import './styles.css'

type Style = {
  hide: boolean
  open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: '1px 2px 8px hsl(0deg 0% 0% / 65%)',
      display: 'flex',
      flexDirection: 'column',
      opacity: (props: Style) => (props.open ? 1 : 0),
      position: 'relative',
      transition: '300ms ease all',
      [theme.breakpoints.up('md')]: {
        maxWidth: (props: Style) => (props.open ? panelWidths.mid : 0),
        flexBasis: (props: Style) => (props.open ? panelWidths.mid : 0),
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: (props: Style) => (props.open ? panelWidths.midLarge : 0),
        flexBasis: (props: Style) => (props.open ? panelWidths.midLarge : 0),
      },
      [theme.breakpoints.down('sm')]: {
        // Prevent extra gap on phone/tablet:
        borderTopWidth: (props: Style) => (props.open ? 4 : 0),
        borderTopColor: theme.palette.primary.dark,
        borderTopStyle: `solid`,
        order: 1, // before nav btns
      },
      [theme.breakpoints.only('xs')]: {
        maxHeight: (props: Style) => (props.open ? 275 : 0),
        minHeight: (props: Style) => (props.open ? 275 : 0),
      },
      [theme.breakpoints.only('sm')]: {
        maxHeight: (props: Style) => (props.open ? '40vh' : 0),
        minHeight: (props: Style) => (props.open ? '40vh' : 0),
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
      },
      '& .trans-group': {
        backgroundColor: theme.palette.background.paper,
        flex: (props: Style) => (props.open ? 1 : 0),
        overflowY: 'auto',
        [theme.breakpoints.up('sm')]: {
          flex: 1,
        },
      },
    },
    panelContent: {
      height: '100%',
      opacity: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '1.25rem 0.75rem',
      position: 'relative',
      width: '100%',
      [theme.breakpoints.up('md')]: {
        padding: '1.5rem 1.25rem',
      },
      [theme.breakpoints.only('sm')]: {
        margin: '1rem auto',
        maxWidth: 675, // slightly fragile but makes for 3x cards per row
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
  const classes = useStyles({ open: panelOpen, hide })

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
      <TransitionGroup className="trans-group">
        <CSSTransition key={loc.key} classNames="fade" timeout={950} appear>
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
