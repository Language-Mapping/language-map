import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import queryString from 'query-string'
import MapGL, { InteractiveMap, MapLoadEvent } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext, LoadingBackdrop } from 'components'
import { LangMbSrcAndLayer } from 'components/map'
import { LangRecordSchema } from '../../context/types'
import { MapEventType, LayerPropsPlusMeta } from './types'
import {
  prepMapPadding,
  flyToCoords,
  handleHover,
  areLangFeatsUnderCursor,
  initLegend,
} from './utils'
import { getMbStyleDocument } from '../../utils'
import {
  mbStylesTilesConfig,
  symbStyleUrl,
  MAPBOX_TOKEN,
  initialMapState,
  postLoadInitMapStates,
} from './config'

type MapRefType = React.RefObject<InteractiveMap>

export const Map: FC = () => {
  const theme = useTheme()
  const history = useHistory()
  const location = useLocation()
  const { state, dispatch } = useContext(GlobalContext)
  const { selFeatAttrbs } = state
  const mapRef: MapRefType = React.createRef()

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  const [viewport, setViewport] = useState(initialMapState)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const [symbLayers, setSymbLayers] = useState<LayerPropsPlusMeta[]>()
  const [labelLayers, setLabelLayers] = useState<LayerPropsPlusMeta[]>()

  // Fetch MB Style doc
  useEffect(() => {
    getMbStyleDocument(
      symbStyleUrl,
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
    if (!mapRef.current || !selFeatAttrbs) {
      return
    }

    const map: mbGlFull.Map = mapRef.current.getMap()

    flyToCoords(
      map,
      {
        lat: selFeatAttrbs.Latitude,
        lng: selFeatAttrbs.Longitude,
      },
      12
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, selFeatAttrbs])

  // Create map legend
  useEffect(() => {
    initLegend(dispatch, state.activeLangSymbGroupId, symbLayers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbLayers])

  function onHover(event: MapEventType) {
    handleHover(event, mbStylesTilesConfig.internalSrcID)
  }

  // Runs only once and kicks off the whole thinig
  function onLoad(mapLoadEvent: MapLoadEvent) {
    const { target: map } = mapLoadEvent

    map.on('zoomend', function handleZoomEnd(mapObj) {
      const { newPosition } = mapObj

      if (!mapObj.newPosition) {
        return
      }

      setViewport({
        zoom: newPosition.zoom,
        latitude: newPosition.center.lat,
        longitude: newPosition.center.lng,
      })
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const langSrcBounds = map.getSource('languages-src').bounds
    map.fitBounds(langSrcBounds) // ensure all feats are visible

    const rawLangFeats = map.querySourceFeatures(
      mbStylesTilesConfig.internalSrcID,
      {
        sourceLayer: mbStylesTilesConfig.layerId,
      }
    )

    // TODO: rm when no longer needed
    // map.showPadding = true // quite handy
    map.setPadding(prepMapPadding(isDesktop))
    // TODO: ^^^^ make pinch and scroll wheel work as expected ^^^^

    // TODO: tighten up query params via TS
    const parsed = queryString.parse(location.search)
    const cacheOfIDs: number[] = []

    const uniqueRecords: LangRecordSchema[] = []

    // Just the properties for table/results, don't need the GeoJSON cruft
    rawLangFeats.forEach((thisFeat) => {
      if (
        !thisFeat.properties ||
        cacheOfIDs.indexOf(thisFeat.properties.ID) !== -1
      ) {
        return
      }

      const justTheProps = thisFeat.properties as LangRecordSchema
      cacheOfIDs.push(justTheProps.ID)

      // Cheap way to set some things while in the middle of the loop
      if (parsed && parsed.id && parsed.id === justTheProps.ID.toString()) {
        dispatch({
          type: 'SET_SEL_FEAT_ATTRIBS',
          payload: justTheProps,
        })
      }

      uniqueRecords.push(justTheProps)
    })

    // If feature selected, `useEffect` will be triggered and handle the
    // zoom. Otherwise fly to the post-load settings that look good on
    // mobile or desktop.
    if (!selFeatAttrbs) {
      const configKey = isDesktop ? 'desktop' : 'mobile'
      flyToCoords(map, postLoadInitMapStates[configKey])
    }

    dispatch({
      type: 'INIT_LANG_LAYER_FEATURES',
      payload: uniqueRecords,
    })

    setMapLoaded(true)
  }

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <MapGL
        {...viewport}
        ref={mapRef}
        height="100%"
        width="100%"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
        // TODO: show MB attribution text (not logo) on mobile
        className="mb-language-map"
        // TODO: mv into utils
        onNativeClick={(event: MapEventType): void => {
          // Deselect currently selected feature if there is one
          if (mapRef.current && selFeatAttrbs) {
            mapRef.current.getMap().setFeatureState(
              {
                sourceLayer: mbStylesTilesConfig.layerId,
                source: mbStylesTilesConfig.internalSrcID,
                id: selFeatAttrbs.ID,
              },
              { selected: false }
            )
          }

          // No language features under click
          if (
            !areLangFeatsUnderCursor(
              event.features,
              mbStylesTilesConfig.internalSrcID
            )
          ) {
            history.push('/')
            dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })

            return
          }

          // TODO: use `initialEntries` in <MemoryRouter> to test routing
          history.push(`/?id=${event.features[0].properties.ID}`)
        }}
        onHover={onHover}
        onLoad={(mapLoadEvent) => {
          onLoad(mapLoadEvent)
        }}
      >
        {/* NOTE: it did not seem to work when using two different Styles with the same dataset unless waiting until there is something to put into <Source> */}
        {symbLayers && labelLayers && (
          <LangMbSrcAndLayer
            selFeatID={selFeatAttrbs ? selFeatAttrbs.ID : null}
            symbLayers={symbLayers}
            labelLayers={labelLayers}
          />
        )}
      </MapGL>
    </>
  )
}
