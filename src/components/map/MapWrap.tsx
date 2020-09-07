import React, { FC, useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { MapPanel } from 'components/panels'
import { Map } from 'components/map'
import { GlobalContext, LoadingBackdrop } from 'components'
import { paths as routes } from 'components/config/routes'
import { LayerPropsNonBGlayer } from './types'
import { mbStyleTileConfig } from './config'
import { useStyles } from './styles'
import { getIDfromURLparams, getMbStyleDocument } from '../../utils'

export const MapWrap: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const loc = useLocation()
  const [symbLayers, setSymbLayers] = useState<LayerPropsNonBGlayer[]>()
  const [labelLayers, setLabelLayers] = useState<LayerPropsNonBGlayer[]>()
  const { langFeaturesCached } = state

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
  // TODO: there's like 3 `return` statements here. How about 1?
  useEffect((): void => {
    const idFromUrl = getIDfromURLparams(loc.search)

    if (!langFeaturesCached.length || !idFromUrl) {
      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: null,
      })

      return
    }

    // TODO: handle scenario where feature exists in cached but not filtered
    // const matchedFeat = state.langFeaturesCached.find(
    //   (feat) => parsed.id === feat.ID.toString()
    // )

    const matchingRecord = langFeaturesCached.find(
      (row) => row.ID === idFromUrl
    )

    if (matchingRecord) {
      document.title = `${matchingRecord.Language as string} - NYC Languages`

      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: matchingRecord,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search, state.langFeaturesCached.length])

  // Open panel for relevant routes
  useEffect((): void => {
    if (loc.pathname === routes.details) {
      dispatch({ type: 'SET_PANEL_STATE', payload: 'default' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.search])

  return (
    <main className={classes.appWrapRoot}>
      {!state.mapLoaded && <LoadingBackdrop />}
      <MapPanel />
      {symbLayers && labelLayers && (
        <Map
          mapWrapClassName={classes.mapWrap}
          symbLayers={symbLayers}
          labelLayers={labelLayers}
          baselayer={state.baselayer}
        />
      )}
    </main>
  )
}
