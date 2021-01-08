import React, { FC, useEffect } from 'react'
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import { panelWidths } from 'components/panels/config'
import { nonNavRoutesConfig } from './config'
import { CloseBtn } from './PanelCloseBtn'
import { PanelTitleBar } from './PanelTitleBar'
import { MapPanelProps, PanelWrapStylesProps } from './types'

import './styles.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottomLeftRadius: 0, // override paper
      borderBottomRightRadius: 0, // override paper
      bottom: 48, // default is set directly in MUI to 56
      boxShadow: '0 -2px 7px hsla(0, 0%, 0%, 0.25)',
      left: 0,
      opacity: (props: PanelWrapStylesProps) => (props.panelOpen ? 1 : 0),
      position: 'absolute',
      right: 0,
      top: '45%',
      transition: '300ms ease all',
      transform: (props: PanelWrapStylesProps) =>
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
  })
)

// WISHLIST: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
export const PanelWrap: FC<MapPanelProps> = (props) => {
  const { setPanelOpen, panelOpen, openOffCanvasNav } = props
  const classes = useStyles({ panelOpen })
  const loc = useLocation()
  const { pathname } = loc
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: 😞
  const isPageWithID = useRouteMatch(['/details/:id', '/table/:id'])?.params.id
  const asArray = pathname.split('/')
  const pageTitle = asArray[4] || asArray[3] || asArray[2] || asArray[1]

  // Home gets default title
  if (!pageTitle) document.title = 'Languages of New York City'
  // Everything else gets the first available path segment, except for detail
  // view via Details or Table.
  else if (!isPageWithID) {
    // CRED: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    const pageTitleCapitalized =
      pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

    document.title = `${pageTitleCapitalized} - NYC Languages`
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document?.activeElement?.blur() // CRED: stackoverflow.com/a/2568972/1048518
  }, [loc])

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Paper id="map-panels-wrap" className={classes.root} elevation={8}>
      <PanelTitleBar openOffCanvasNav={openOffCanvasNav}>
        <CloseBtn onClick={() => setPanelOpen(false)} />
      </PanelTitleBar>
      <TransitionGroup>
        <CSSTransition key={loc.key} classNames="fade" timeout={950} appear>
          <Switch location={loc}>
            {nonNavRoutesConfig.map((config) => (
              <Route
                exact={config.exact}
                path={config.rootPath}
                key={config.rootPath}
              >
                {config.component ||
                  (config.renderComponent && config.renderComponent(props))}
              </Route>
            ))}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </Paper>
  )
}
