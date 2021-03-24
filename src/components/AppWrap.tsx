import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { InteractiveMap } from 'react-map-gl'

import { PanelWrap, usePanelState } from 'components/panels'
import { TopBar, OffCanvasNav } from 'components/nav'
import { Map } from 'components/map'
import { LoadingBackdrop } from 'components/generic/modals'
import { BottomNav } from './nav/BottomNav'
import { BOTTOM_NAV_HEIGHT_MOBILE } from './nav/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainWrap: {
      top: 0,
      bottom: 0,
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      '& .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.background.paper,
      },
      '& .mapboxgl-popup-content': {
        backgroundColor: theme.palette.background.paper,
      },
      [theme.breakpoints.down('sm')]: {
        '& .mapboxgl-ctrl-bottom-left > .mapboxgl-ctrl': {
          marginBottom: '0.5rem', // MB logo has too much spacing
        },
        '& .mapboxgl-ctrl-bottom-right > .mapboxgl-ctrl': {
          marginBottom: '0.25rem', // MB attribution needs a little spacing
        },
        '& .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left': {
          transition: 'bottom 300ms ease',
          bottom: (props: { panelOpen: boolean }) =>
            props.panelOpen ? 'calc(50% + 0.45rem)' : 0,
        },
      },
    },
    mapWrap: {
      position: 'fixed',
      bottom: BOTTOM_NAV_HEIGHT_MOBILE,
      left: 0,
      right: 0,
      top: 0,
      width: '100%',
      [theme.breakpoints.up('md')]: {
        bottom: 0,
      },
    },
  })
)

export const AppWrap: FC = () => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const { panelOpen } = usePanelState()
  const classes = useStyles({ panelOpen })
  const [offCanvasNavOpen, setOffCanvasNavOpen] = useState<boolean>(false)
  const mapRef: React.RefObject<InteractiveMap> = React.useRef(null)

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <TopBar />
      <main className={classes.mainWrap}>
        <div className={classes.mapWrap}>
          <Map
            mapRef={mapRef}
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
          />
        </div>
        <PanelWrap
          mapRef={mapRef}
          openOffCanvasNav={(e: React.MouseEvent) => {
            e.preventDefault()
            setOffCanvasNavOpen(true)
          }}
        />
        <BottomNav />
      </main>
      <OffCanvasNav isOpen={offCanvasNavOpen} setIsOpen={setOffCanvasNavOpen} />
    </>
  )
}
