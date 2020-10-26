import React, { FC, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { GlobalContext, LoadingBackdrop } from 'components'
import { FabPanelToggle } from 'components/panels/FabPanelToggle'
import { Panel } from 'components/panels'
import { getIDfromURLparams } from '../../utils'
import { useStyles } from './styles'

type MapWrapProps = { map: React.ReactNode; mapLoaded: boolean }

export const MapWrap: FC<MapWrapProps> = (props) => {
  const { mapLoaded, map: Map } = props
  const { state, dispatch } = useContext(GlobalContext)
  const loc = useLocation()
  const { langFeatures } = state
  const classes = useStyles({ panelOpen: state.panelState === 'default' })

  // TODO: rm all this from global state. Should only need router stuff and
  // state.langFeatures in Details to get selFeatAttribs.
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

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <main className={classes.appWrapRoot}>
        <div className={classes.mapWrap}>{Map}</div>
        <Panel />
        <FabPanelToggle />
      </main>
    </>
  )
}
