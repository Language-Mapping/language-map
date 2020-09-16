import React, { FC, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { FabPanelToggle } from 'components/panels'
import { Map } from 'components/map'
import { GlobalContext, LoadingBackdrop } from 'components'
import { useStyles } from './styles'
import { getIDfromURLparams } from '../../utils'

export const MapWrap: FC = (props) => {
  const { children } = props
  const { state, dispatch } = useContext(GlobalContext)
  const loc = useLocation()
  const { langFeatures } = state

  const classes = useStyles({
    panelOpen: state.panelState === 'default',
  })

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
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: matchingRecord })
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
      <main className={classes.appWrapRoot}>
        <FabPanelToggle />
        <div className={classes.mapWrap}>
          <Map baselayer={state.baselayer} />
        </div>
        {/* children should just be MapPanel */}
        {children}
      </main>
    </>
  )
}
