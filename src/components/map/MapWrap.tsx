import React, { FC, useState, useContext, useEffect } from 'react'
import { useLocation, Switch, Route } from 'react-router-dom'
import { Box } from '@material-ui/core'

import {
  MapPanel,
  MapPanelContent,
  MapPanelHeader,
  MapPanelHeaderChild,
} from 'components/panels'
import { Map } from 'components/map'
import { GlobalContext } from 'components'
import { LayerPropsNonBGlayer, RouteLocation } from './types'
import { mbStyleTileConfig } from './config'
import { useStyles } from './styles'
import { panelsConfig } from '../../config/panels-config'
import { getIDfromURLparams, getMbStyleDocument } from '../../utils'

export const MapWrap: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const [panelOpen, setPanelOpen] = useState(true)
  const classes = useStyles({ panelOpen, screenHeight: window.innerHeight })
  const loc = useLocation()
  const [symbLayers, setSymbLayers] = useState<LayerPropsNonBGlayer[]>()
  const [labelLayers, setLabelLayers] = useState<LayerPropsNonBGlayer[]>()
  const { langFeaturesCached } = state

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
    const idFromUrl = getIDfromURLparams(window.location.search)

    if (!langFeaturesCached.length) {
      return
    }

    if (!idFromUrl || idFromUrl === -1) {
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
      (record) => record.ID === idFromUrl
    )

    if (!matchingRecord) {
      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: null,
      })

      return
    }

    document.title = `${matchingRecord.Language as string} - NYC Languages`

    dispatch({
      type: 'SET_SEL_FEAT_ATTRIBS',
      payload: matchingRecord,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc, state.langFeaturesCached.length])

  // Open panel for relevant routes
  useEffect((): void => {
    const pathsToTriggerOpen = ['/details', '/'] as RouteLocation[]

    if (pathsToTriggerOpen.includes(loc.pathname as RouteLocation)) {
      setPanelOpen(true)
    }
  }, [loc])

  // Open panel as needed (may have been some conflicts/redundancy with
  // `location`, and still redundancy but it does work)
  useEffect((): void => {
    setPanelOpen(panelOpen)
  }, [panelOpen])

  return (
    <div className={classes.mapWrapRoot}>
      {symbLayers && labelLayers && (
        <Map
          wrapClassName={classes.mapItselfWrap}
          symbLayers={symbLayers}
          labelLayers={labelLayers}
          baselayer={state.baselayer}
        />
      )}
      {/* Need the `id` in order to find unique element for `map.setPadding` */}
      <Box id="map-panels-wrap" className={classes.mapPanelsWrap}>
        <MapPanel>
          <MapPanelHeader>
            {/* Gross but "/" route needs to come last */}
            {[...panelsConfig].reverse().map((config) => (
              <MapPanelHeaderChild
                key={config.heading}
                {...config}
                active={loc.pathname === config.path}
                panelOpen={panelOpen}
                setPanelOpen={setPanelOpen}
              >
                {config.component}
              </MapPanelHeaderChild>
            ))}
          </MapPanelHeader>
          <Switch>
            {panelsConfig.map((config) => (
              <Route key={config.heading} path={config.path}>
                <MapPanelContent
                  {...config}
                  active={loc.pathname === config.path}
                  panelOpen={panelOpen}
                >
                  {config.component}
                </MapPanelContent>
              </Route>
            ))}
          </Switch>
        </MapPanel>
      </Box>
    </div>
  )
}
