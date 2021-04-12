import React, { FC, useRef } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Hidden } from '@material-ui/core'

import {
  SearchTabs,
  usePanelState,
  PanelCloseBtnSticky,
} from 'components/panels'
import { BackToTopBtn, useHideOnScroll } from 'components/generic'
import { BottomNav } from 'components/nav'
import { PanelTitleBar } from './PanelTitleBar'
import { PanelWrapProps } from './types'

import { panelWidths, nonNavRoutesConfig } from './config'
import './styles.css'

type Style = { open: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      bottom: 0,
      boxShadow: '1px 2px 8px hsl(0deg 0% 0% / 65%)',
      position: 'absolute',
      top: '50%',
      transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      [theme.breakpoints.up('md')]: {
        bottom: 0,
        left: 0,
        top: 0,
        width: panelWidths.mid,
        opacity: (props: Style) => (props.open ? 1 : 0),
        transform: (props: Style) =>
          props.open ? 'translateX(0)' : `translateX(-100%)`,
      },
      [theme.breakpoints.up('xl')]: {
        width: panelWidths.midLarge,
      },
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        borderTop: `solid 6px ${theme.palette.primary.dark}`,
      },
      '& .MuiInputLabel-formControl': {
        color: theme.palette.text.secondary,
        fontSize: '1rem',
      },
      '& .trans-group': {
        height: '100%',
        width: '100%',
        [theme.breakpoints.up('md')]: {
          position: 'relative', // not sure if needed
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
      },
      [theme.breakpoints.down('sm')]: {
        opacity: (props: Style) => (props.open ? 1 : 0),
        transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        height: '100%',
        padding: '1rem 0.75rem 1.25rem',
      },
      [theme.breakpoints.only('sm')]: {
        margin: '1rem auto',
        padding: '1.5rem 8vw',
      },
      [theme.breakpoints.up('xl')]: {
        padding: '1.75rem 1.5rem',
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
  const targetElemID = 'back-to-top-anchor'
  const panelRef = useRef<HTMLDivElement | null>(null)
  const hide = useHideOnScroll(panelRef.current)
  const classes = useStyles({ open: panelOpen })

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
            {/* Last-ditch effort to allow scrolling on mobile */}
            <div style={{ height: 200, width: '100%' }} />
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
