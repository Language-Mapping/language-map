import React, { FC, useState, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { InteractiveMap } from 'react-map-gl'
import { Hidden } from '@material-ui/core'

import { PanelWrap, usePanelState, ShowPanelBtn } from 'components/panels'
import { BottomNav, TopBar } from 'components/nav'
import { WelcomeDialog, HIDE_WELCOME_LOCAL_STG_KEY } from 'components/about'
import { Map } from 'components/map'
import {
  LoadingBackdropEmpty,
  LoadingTextOnElem,
} from 'components/generic/modals'
import { PanelTitleBar } from './panels/PanelTitleBar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      bottom: 0,
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      transition: '300ms ease all',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
      '& .map-container': {
        flex: 1,
        position: 'relative', // for logo on wider screens
        [theme.breakpoints.up('md')]: {
          borderTop: `solid ${theme.palette.primary.dark} 3px`,
          borderBottom: `solid ${theme.palette.primary.dark} 3px`,
          display: 'flex',
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
  const classes = useStyles({ panelOpen })
  const mapRef: React.RefObject<InteractiveMap> = React.useRef(null)
  const [showWelcome, setShowWelcome] = useState<boolean | null | string>(
    window.localStorage.getItem(HIDE_WELCOME_LOCAL_STG_KEY)
  )

  useEffect(() => {
    setShowWelcome(!window?.localStorage.getItem(HIDE_WELCOME_LOCAL_STG_KEY))
  }, [])

  return (
    <>
      {showWelcome && <WelcomeDialog />}
      <LoadingBackdropEmpty open={!mapLoaded} />
      <ShowPanelBtn panelOpen={panelOpen} />
      <main className={classes.root}>
        <Hidden mdUp>
          <PanelTitleBar />
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
