import React, { FC, useState, useEffect } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { InteractiveMap } from 'react-map-gl'

import { PanelWrap, usePanelState, ShowPanelBtn } from 'components/panels'
import { TopBar } from 'components/nav'
import { WelcomeDialog, HIDE_WELCOME_LOCAL_STG_KEY } from 'components/about'
import { Map } from 'components/map'
import { LoadingBackdrop } from 'components/generic/modals'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      top: 0,
      bottom: 0,
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        // TODO: rm when done
        // '& .mapboxgl-ctrl-bottom-left > .mapboxgl-ctrl': {
        //   marginBottom: '0.5rem', // MB logo has too much spacing
        // },
        // '& .mapboxgl-ctrl-bottom-right > .mapboxgl-ctrl': {
        //   marginBottom: '0.25rem', // MB attribution needs a little spacing
        // },
        // '& .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left': {
        //   transition: 'bottom 300ms ease',
        //   bottom: (props: { panelOpen: boolean }) =>
        //     props.panelOpen ? 'calc(50% + 0.45rem)' : 0,
        // },
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
      {!mapLoaded && <LoadingBackdrop text="Loading..." />}
      <TopBar />
      <main className={classes.root}>
        <ShowPanelBtn panelOpen={panelOpen} />
        <PanelWrap mapRef={mapRef} />
        <Map
          mapRef={mapRef}
          mapLoaded={mapLoaded}
          setMapLoaded={setMapLoaded}
        />
      </main>
    </>
  )
}
