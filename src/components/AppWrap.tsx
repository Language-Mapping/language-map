import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { InteractiveMap } from 'react-map-gl'
import { Hidden } from '@material-ui/core'

import { panelWidths } from 'components/panels/config'
import { PanelWrap, usePanelState, ShowPanelBtn } from 'components/panels'
import { BottomNav, TopBar } from 'components/nav'
import { WelcomeDialog } from 'components/about'
import { Map } from 'components/map'
import {
  LoadingBackdropEmpty,
  LoadingTextOnElem,
} from 'components/generic/modals'
import {
  PANEL_TITLE_BAR_HT_MOBILE,
  BOTTOM_NAV_HEIGHT_MOBILE,
} from 'components/nav/config'
import { PanelTitleBar } from './panels/PanelTitleBar'
import { usePageTitle, useShowWelcome } from './generic/hooks'

type Style = { open: boolean }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      '& .map-container': {
        position: 'absolute', // for logo on wider screens
        zIndex: 1, // above stick close X on mobile panels
        transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        [theme.breakpoints.up('md')]: {
          borderTop: `solid ${theme.palette.primary.dark} 3px`,
          borderBottom: `solid ${theme.palette.primary.dark} 3px`,
          display: 'flex',
          left: (props: Style) => (props.open ? panelWidths.mid : 0),
          right: 0,
          top: 0,
          bottom: 0,
        },
        [theme.breakpoints.up('xl')]: {
          left: (props: Style) => (props.open ? panelWidths.midLarge : 0),
        },
        [theme.breakpoints.down('sm')]: {
          top: PANEL_TITLE_BAR_HT_MOBILE,
          width: '100%',
          bottom: (props: Style) =>
            props.open ? '50%' : BOTTOM_NAV_HEIGHT_MOBILE,
        },
      },
      // TODO: into MapPopup component, and increase "X" size
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  })
)

export const AppWrap: FC = () => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const { panelOpen } = usePanelState()
  const classes = useStyles({ open: panelOpen })
  const mapRef: React.RefObject<InteractiveMap> = React.useRef(null)
  const showWelcome = useShowWelcome()

  usePageTitle()

  return (
    <>
      {showWelcome && <WelcomeDialog />}
      <LoadingBackdropEmpty open={!mapLoaded} />
      <ShowPanelBtn panelOpen={panelOpen} />
      <main className={classes.root}>
        <Hidden mdUp>
          <PanelTitleBar mapRef={mapRef} />
        </Hidden>
        <PanelWrap mapRef={mapRef} />
        <Map mapRef={mapRef} mapLoaded={mapLoaded} setMapLoaded={setMapLoaded}>
          <TopBar />
          {!mapLoaded && <LoadingTextOnElem />}
        </Map>
        <Hidden mdUp>
          <BottomNav />
        </Hidden>
      </main>
    </>
  )
}
