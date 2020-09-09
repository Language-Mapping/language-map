import React, { FC, useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { MapPanel, FabPanelToggle } from 'components/panels'
import { Map } from 'components/map'
import { GlobalContext, LoadingBackdrop } from 'components'
import { LayerPropsNonBGlayer } from './types'
import { mbStyleTileConfig } from './config'
import { useStyles } from './styles'
import { getIDfromURLparams, getMbStyleDocument } from '../../utils'

export const MapWrap: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const loc = useLocation()
  const [symbLayers, setSymbLayers] = useState<LayerPropsNonBGlayer[]>()
  const [labelLayers, setLabelLayers] = useState<LayerPropsNonBGlayer[]>()
  const { langFeatures } = state

  const classes = useStyles({
    panelOpen: state.panelState === 'default',
  })

  // Fetch MB Style doc
  useEffect(() => {
    getMbStyleDocument(
      mbStyleTileConfig.symbStyleUrl,
      dispatch,
      setSymbLayers,
      setLabelLayers
    ).catch((errMsg) => {
      // eslint-disable-next-line no-console
      console.error(
        // TODO: wire up sentry
        `Something went wrong trying to fetch MB style JSON: ${errMsg}`
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Do selected feature stuff on location change
  useEffect((): void => {
    const idFromUrl = getIDfromURLparams(loc.search)

    if (!langFeatures.length || !idFromUrl) {
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })

      return
    }

    // TODO: handle scenario where feature exists in cached but not filtered
    // const matchedFeat = state.langFeatures.find()

    const matchingRecord = langFeatures.find((row) => row.ID === idFromUrl)

    if (matchingRecord) {
      document.title = `${matchingRecord.Language as string} - NYC Languages`

      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: matchingRecord,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search, state.langFeatures.length])

  // Open panel for relevant routes // TODO: something
  // useEffect((): void => {
  //   if (loc.pathname === routes.details) {
  //     dispatch({ type: 'SET_PANEL_STATE', payload: 'default' })
  //   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loc.search])

  return (
    <>
      {!state.mapLoaded && <LoadingBackdrop />}
      <FabPanelToggle />
      <main className={classes.appWrapRoot}>
        <MapPanel />
        {symbLayers && labelLayers && (
          <div className={classes.mapWrap}>
            <Map
              symbLayers={symbLayers}
              labelLayers={labelLayers}
              baselayer={state.baselayer}
            />
          </div>
        )}
      </main>
    </>
  )
}
