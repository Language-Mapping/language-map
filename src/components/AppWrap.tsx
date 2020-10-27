import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { MapPanel } from 'components/panels'
import { TopBar, OffCanvasNav } from 'components/nav'
import { Map } from 'components/map'
import { LoadingBackdrop } from 'components'
import { BottomNav } from './nav/BottomNav'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainWrap: {
      top: 0,
      bottom: 0,
      position: 'absolute',
      height: '100%',
      width: '100%',
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
  const classes = useStyles()
  const [panelOpen, setPanelOpen] = useState(true)
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

  //   // TODO: handle scenario where feature exists in cached but not filtered
  //   // const matchedFeat = state.langFeatures.find()

  //   const matchingRecord = langFeatures.find((row) => row.ID === idFromUrl)

  //   if (matchingRecord) {
  //     document.title = `${matchingRecord.Language as string} - NYC Languages`
  //     dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: matchingRecord })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loc.search, state.langFeatures.length])

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <TopBar />
      <main className={classes.mainWrap}>
        <div style={{ position: 'fixed', height: '100%', width: '100%' }}>
          <Map
            openOffCanvasNav={() => setOffCanvasNavOpen(false)}
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
          />
        </div>
        <BottomNav setPanelOpen={setPanelOpen} panelOpen={panelOpen} />
        <MapPanel
          panelOpen={panelOpen}
          closePanel={() => setPanelOpen(false)}
        />
      </main>
      <OffCanvasNav isOpen={offCanvasNavOpen} setIsOpen={setOffCanvasNavOpen} />
    </>
  )
}
