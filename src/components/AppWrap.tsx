import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { PanelWrap } from 'components/panels'
import { TopBar, OffCanvasNav } from 'components/nav'
import { Map } from 'components/map'
import { LoadingBackdrop } from 'components/generic/modals'
import { BottomNav } from './nav/BottomNav'

type StyleProps = {
  panelOpen: boolean
}

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
          bottom: (props: StyleProps) => (props.panelOpen ? '51' : 0),
        },
      },
    },
    mapWrap: {
      position: 'fixed',
      bottom: 56,
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
  const [panelOpen, setPanelOpen] = useState<boolean>(true)
  const classes = useStyles({ panelOpen })
  const [offCanvasNavOpen, setOffCanvasNavOpen] = useState<boolean>(false)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)

  // TODO: restore then rm all this from global state. Should only need router
  // stuff and state.langFeatures in Details to get selFeatAttribs.
  // Do selected feature stuff on location change
  // useEffect((): void => {
  //   const idFromUrl = getIDfromURLparams(loc.search)

  //   if (!langFeatures.length || !idFromUrl) {
  //     dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })

  //     return
  //   }
  // TODO: handle scenario where feature exists in cached but not filtered
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loc.search, state.langFeatures.length])

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <TopBar />
      <main className={classes.mainWrap}>
        <div className={classes.mapWrap}>
          <Map
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
            panelOpen={panelOpen}
          />
        </div>
        <PanelWrap
          panelOpen={panelOpen}
          setPanelOpen={setPanelOpen}
          openOffCanvasNav={(e: React.MouseEvent) => {
            e.preventDefault()
            setOffCanvasNavOpen(true)
          }}
        />
        <BottomNav setPanelOpen={setPanelOpen} />
      </main>
      <OffCanvasNav isOpen={offCanvasNavOpen} setIsOpen={setOffCanvasNavOpen} />
    </>
  )
}
