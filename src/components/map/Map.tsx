/* eslint-disable react-hooks/exhaustive-deps */
// TOO annoying. I'll take the risk, esp. since it has not seemed problematic:
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory, Route } from 'react-router-dom'
import {
  AttributionControl,
  Map as MbMap, // TODO: try to lazy load the biggest dep of all. See:
  // www.debugbear.com/blog/bundle-splitting-components-with-webpack-and-react
  setRTLTextPlugin,
  LngLatBounds,
} from 'mapbox-gl'
import MapGL, { MapLoadEvent } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import { paths as routes } from 'components/config/routes'
import * as contexts from 'components/context'

import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { Geolocation } from './Geolocation'
import { LanguagePopup, MapPopup } from './MapPopup'
import { MapCtrlBtns } from './MapCtrlBtns'
import { BoundariesLayer } from './BoundariesLayer'
import { CensusLayer } from './CensusLayer'
import { GeocodeMarker } from './GeocodeMarker'

import * as config from './config'
// import * as events from './events' // FIXME: boundary stuff
import * as hooks from './hooks'
import * as sharedUtils from '../../utils'
import * as Types from './types'
import * as utils from './utils'

const {
  neighbConfig,
  countiesConfig,
  boundariesLayerIDs,
  langTypeIconsConfig,
} = config

// Jest or whatever CANNOT find this plugin. And importing it from
// `react-map-gl` is useless as well.
if (typeof window !== undefined && typeof setRTLTextPlugin === 'function') {
  // Ensure right-to-left languages (Arabic, Hebrew) are shown correctly
  setRTLTextPlugin(
    // latest version: https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    (error): Error => error, // supposed to be an error-handling function
    true // lazy: only load when the map first encounters Hebrew or Arabic text
  )
}

export const Map: FC<Types.MapProps> = (props) => {
  const history = useHistory()
  const { mapLoaded, mapRef, panelOpen, setMapLoaded } = props
  const map: MbMap | undefined = mapRef.current?.getMap()
  const { selFeatAttribs } = hooks.usePopupFeatDetails()
  const { state } = useContext(contexts.GlobalContext)
  const symbLabelState = contexts.useSymbAndLabelState()
  const { boundariesVisible } = contexts.useMapToolsState()
  const offset = hooks.useOffset(panelOpen)
  const breakpoint = hooks.useBreakpoint()
  const { langFeatures } = state
  const { activeSymbGroupID } = symbLabelState
  const [beforeId, setBeforeId] = useState<string>('background')

  const [
    geocodeMarker,
    setGeocodeMarker,
  ] = useState<Types.GeocodeMarker | null>()
  const [viewport, setViewport] = useState<Types.ViewportState>(
    config.initialMapState
  )
  const [hidePopup, setHidePopup] = useState<boolean>(false)
  const [tooltip, setTooltip] = useState<Types.PopupSettings | null>(null)
  const [
    clickedBoundary,
    setClickedBoundary,
  ] = useState<Types.BoundaryFeat | null>()

  // const cache = useQueryCache() // FIXME: all this mess
  // const symbCache = cache.getQueryData([activeSymbGroupID, 'legend']) || []
  // const interactiveLayerIds = symbCache
  // Handle MB Boundaries feature click
  // useEffect((): void => {
  //   if (!map || !clickedBoundary) return

  //   const boundaryData = cache.getQueryData(
  //     clickedBoundary.source
  //   ) as Types.BoundaryLookup[]

  //   events.handleBoundaryClick(
  //     map,
  //     clickedBoundary,
  //     { width: viewport.width as number, height: viewport.height as number },
  //     boundaryData,
  //     offset
  //   )
  // }, [clickedBoundary])

  // Fly to extent of lang features on length change
  useEffect((): void => {
    if (!map || !langFeatures.length) return

    // TODO: better check/decouple the fly-home-on-filter-reset behavior so that
    // there are no surprise fly-to-home scenarios.
    if (langFeatures.length === state.langFeatsLenCache) {
      utils.flyHome(map, nuclearClear, offset)

      return
    }

    const firstCoords: [number, number] = [
      langFeatures[0].Longitude,
      langFeatures[0].Latitude,
    ]

    // Zooming to "bounds" gets crazy if there is only one feature
    if (langFeatures.length === 1) {
      utils.flyToPoint(
        map,
        {
          latitude: firstCoords[1],
          longitude: firstCoords[0],
          zoom: config.POINT_ZOOM_LEVEL,
          pitch: 80,
          offset,
        },
        null
      )

      return
    }

    const bounds = langFeatures.reduce(
      (all, thisOne) => all.extend([thisOne.Longitude, thisOne.Latitude]),
      new LngLatBounds(firstCoords, firstCoords)
    )

    utils.flyToBounds(
      map,
      {
        height: window.innerHeight as number,
        width: window.innerWidth as number,
        bounds: bounds.toArray() as Types.BoundsArray,
        offset,
      },
      null
    )
  }, [langFeatures.length])

  // Filter lang feats in map on length change or symbology change
  useEffect((): void => {
    if (!map || !mapLoaded) return

    const getLangLayersIDs = utils.getLangLayersIDs(map.getStyle().layers || [])

    utils.filterLayersByFeatIDs(
      map,
      getLangLayersIDs,
      sharedUtils.getAllLangFeatIDs(langFeatures)
    )
  }, [langFeatures.length, beforeId])

  // (Re)load symbol icons. Must be done on load and whenever `baselayer` is
  // changed, otherwise the images no longer exist.
  useEffect((): void => {
    if (!mapRef.current) return

    utils.addLangTypeIconsToMap(mapRef.current.getMap(), langTypeIconsConfig)
  }, []) // add `baselayer` as dep if using more than just light BG
  /* eslint-enable react-hooks/exhaustive-deps */

  // Do selected feature stuff on sel feat change or map load
  useEffect((): void => {
    if (!map || !mapLoaded || !selFeatAttribs) return

    nuclearClear()

    const settings = utils.getFlyToPointSettings(selFeatAttribs, offset)

    utils.flyToPoint(map, settings, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selFeatAttribs]) // LEGIT disabling of deps. Breaks otherwise.

  const nuclearClear = () => {
    setHidePopup(true)
    setGeocodeMarker(null)
    setTooltip(null)
  }

  // TODO: use `if (map.isSourceLoaded('sourceId')` if possible
  function onLoad(mapLoadEvent: MapLoadEvent) {
    // `mapObj` should === `map` but avoid naming conflict just in case:
    const { target: mapObj } = mapLoadEvent

    // Maintain viewport state sync if needed (e.g. after `flyTo`), otherwise
    // the map shifts back to previous position after panning or zooming.
    mapObj.on('moveend', function onMoveEnd(zoomEndEvent) {
      setHidePopup(false)

      // No custom event data, regular move event
      if (zoomEndEvent.forceViewportUpdate) {
        setViewport({
          ...viewport, // spreading just in case bearing or pitch are added
          latitude: mapObj.getCenter().lat,
          longitude: mapObj.getCenter().lng,
          pitch: mapObj.getPitch(),
          zoom: mapObj.getZoom(),
        })
      }
    })

    // Close popup on the start of moving so no jank
    mapObj.on('movestart', function onMoveStart(zoomEndEvent) {
      setHidePopup(true)

      if (zoomEndEvent.forceViewportUpdate) nuclearClear()
    })

    mapObj.on('sourcedata', function onStyleData(e) {
      if (!e.isSourceLoaded) return

      const layers = e.style._layers
      const before = utils.getBeforeID(activeSymbGroupID, layers)

      setBeforeId(before)
    })

    mapObj.on('zoomend', function onMoveEnd(customEventData) {
      const { geocodeMarker: geocodeMarkerParams } = customEventData
      // as MapTypes.CustomEventData // WHYYYY ERRORS

      setHidePopup(false)

      if (geocodeMarkerParams) setGeocodeMarker(geocodeMarkerParams)
    })

    mapObj.addControl(
      new AttributionControl({ compact: false }), // Give MB well-deserved cred
      'bottom-right'
    )

    setMapLoaded(true)

    if (selFeatAttribs) {
      const settings = utils.getFlyToPointSettings(selFeatAttribs, offset)

      utils.flyToPoint(mapObj, settings, null)
    } else {
      utils.flyHome(mapObj, nuclearClear, offset)
    }
  }

  function onClick(event: Types.MapEvent): void {
    if (!map || !mapLoaded) return

    const topLangFeat = utils.langFeatsUnderClick(event.point, map, {
      // CRED: https://stackoverflow.com/a/42984268/1048518
      lang: utils.getLangLayersIDs(map.getStyle().layers || []),
    })[0]

    nuclearClear() // can't rely on history

    if (!topLangFeat) {
      history.push('/details')
    } else {
      history.push(`${routes.details}/${topLangFeat.properties?.id}`)

      return // prevent boundary click underneath
    }

    if (!boundariesVisible) return

    const boundariesClicked = map.queryRenderedFeatures(event.point, {
      layers: boundariesLayerIDs,
    }) as Types.BoundaryFeat[]

    if (!boundariesClicked.length) return

    setClickedBoundary(boundariesClicked[0])
  }

  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!map || !mapLoaded) return

    if (actionID === 'home') {
      utils.flyHome(map, nuclearClear, offset)
    } else if (actionID === 'reset-pitch') {
      setViewport({ ...viewport, pitch: 0 })

      // Pitch reset in 50/50 page layout on smaller screens needs extra love:
      if (panelOpen && breakpoint === 'mobile') {
        setTimeout(() => {
          map.panBy([0, 2 * offset[1] + 50], undefined, {
            forceViewportUpdate: true,
          })
        }, 5)
      }
    } else if (actionID === 'in') {
      map.zoomIn({ offset })
    } else if (actionID === 'out') {
      map.zoomOut({ offset })
    }
  }

  return (
    <>
      <MapGL
        {...viewport}
        {...config.mapProps}
        ref={mapRef}
        /* eslint-disable operator-linebreak */
        // interactiveLayerIds={
        //   boundariesVisible
        //     ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //       // @ts-ignore
        //       [...boundariesLayerIDs, ...interactiveLayerIds]
        //     : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //       // @ts-ignore
        //       [...interactiveLayerIds]
        // }
        /* eslint-enable operator-linebreak */
        onViewportChange={setViewport}
        onClick={(event: Types.MapEvent) => onClick(event)}
        // onHover={onHover}
        onLoad={(mapLoadEvent) => onLoad(mapLoadEvent)}
      >
        <Geolocation
          onViewportChange={(mapViewport: Types.ViewportState) => {
            // CRED:
            // github.com/visgl/react-map-gl/issues/887#issuecomment-531580394
            setViewport({ ...mapViewport, zoom: config.POINT_ZOOM_LEVEL })
          }}
        />
        {geocodeMarker && <GeocodeMarker {...geocodeMarker} />}
        {[neighbConfig, countiesConfig].map((boundaryConfig) => (
          <BoundariesLayer
            key={boundaryConfig.source.id}
            {...boundaryConfig}
            visible={boundariesVisible}
            {...{ beforeId, map, clickedBoundary }}
          />
        ))}
        <CensusLayer
          map={map}
          mapRef={mapRef}
          config={config.pumaConfig}
          beforeId={beforeId}
          sourceLayer={config.pumaLyrSrc['source-layer']}
        />
        <CensusLayer
          map={map}
          mapRef={mapRef}
          config={config.tractsConfig}
          beforeId={beforeId}
          sourceLayer={config.tractsLyrSrc['source-layer']}
        />
        <LangMbSrcAndLayer />
        <Route path="/details/:id">
          {mapLoaded && !hidePopup && (
            <LanguagePopup settings={selFeatAttribs} />
          )}
        </Route>
        {/* Popups are annoying on mobile */}
        {!sharedUtils.isTouchEnabled() && tooltip && (
          <MapPopup {...tooltip} setVisible={() => setTooltip(null)} />
        )}
      </MapGL>
      <MapCtrlBtns
        isPitchZero={viewport.pitch === 0}
        onMapCtrlClick={(actionID: Types.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </>
  )
}
