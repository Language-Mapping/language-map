import React, { FC, useRef } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Hidden } from '@material-ui/core'

import {
  SearchTabs,
  usePanelState,
  PanelCloseBtnSticky,
} from 'components/panels'
import { BackToTopBtn, useHideOnScroll } from 'components/generic'
import { BottomNav } from 'components/nav'
import {
  BOTTOM_NAV_HEIGHT,
  BOTTOM_NAV_HEIGHT_MOBILE,
} from 'components/nav/config'
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
        bottom: BOTTOM_NAV_HEIGHT_MOBILE,
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
      bottom: BOTTOM_NAV_HEIGHT,
      opacity: 1,
      overflowX: 'hidden',
      padding: '1.35rem 0.85rem',
      position: 'absolute',
      top: 48,
      width: '100%',
      [theme.breakpoints.up('md')]: {
        padding: '1.5rem 1.25rem',
      },
      [theme.breakpoints.down('sm')]: {
        bottom: 0,
        top: 0,
        opacity: (props: Style) => (props.open ? 1 : 0),
      },
      [theme.breakpoints.only('sm')]: {
        padding: '1.5rem 8vw', // nice cushion on iPad portrait
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
  const { panelOpen } = usePanelState()
  const loc = useLocation()
  const targetElemID = 'back-to-top-anchor'
  const panelRef = useRef<HTMLDivElement | null>(null)
  const hide = useHideOnScroll(panelRef)
  const classes = useStyles({ open: panelOpen })

  return (
    <div className={classes.root}>
      <Hidden smDown>
        <PanelTitleBar mapRef={mapRef} />
      </Hidden>
      <Hidden mdUp>
        <PanelCloseBtnSticky />
      </Hidden>
      <div className={classes.panelContent} ref={panelRef}>
        <div id={targetElemID} />
        <Route path="/" exact>
          <div style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>
            <SearchTabs mapRef={mapRef} />
          </div>
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
      <BackToTopBtn hide={hide} targetElemID={targetElemID} />
      <Hidden smDown>
        <BottomNav />
      </Hidden>
    </div>
  )
}
