/* eslint-disable react-hooks/exhaustive-deps */
// TOO annoying. I'll take the risk, esp. since it has not seemed problematic:
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useContext, useEffect } from 'react'
import { useQueryCache } from 'react-query'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import {
  AttributionControl,
  Map as MbMap, // TODO: try to lazy load the biggest dep of all. See:
  // www.debugbear.com/blog/bundle-splitting-components-with-webpack-and-react
  setRTLTextPlugin,
  LngLatBounds,
} from 'mapbox-gl'
import MapGL, { MapLoadEvent } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import {
  GlobalContext,
  useMapToolsState,
  useSymbAndLabelState,
} from 'components/context'
import { paths as routes } from 'components/config/routes'
import { LangRecordSchema } from 'components/context/types'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { Geolocation } from './Geolocation'
import { MapPopup } from './MapPopup'
import { MapCtrlBtns } from './MapCtrlBtns'
import { BoundariesLayer } from './BoundariesLayer'
import { CensusLayer } from './CensusLayer'
import { GeocodeMarker } from './GeocodeMarker'

import * as Types from './types'
import * as utils from './utils'
import * as hooks from './hooks'
import * as config from './config'
import * as events from './events'
import symbLayers from './config.lang-style'

import {
  getIDfromURLparams,
  findFeatureByID,
  getAllLangFeatIDs,
  isTouchEnabled,
} from '../../utils'

const { layerId: sourceLayer, langSrcID } = config.mbStyleTileConfig
const { neighbConfig, countiesConfig, boundariesLayerIDs } = config
const interactiveLayerIds = symbLayers.map((symbLayer) => symbLayer.id)

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
  const { mapLoaded, mapRef } = props
  const { panelOpen, setMapLoaded } = props
  const map: MbMap | undefined = mapRef.current?.getMap()

  // Routing
  const history = useHistory()
  const loc = useLocation()
  const match: { params: { id: string } } | null = useRouteMatch('/details/:id')
  const matchedID = match?.params?.id

  const { state, dispatch } = useContext(GlobalContext)
  const symbLabelState = useSymbAndLabelState()
  // const { boundariesVisible, tractsField, pumaField } = useMapToolsState()
  const { boundariesVisible } = useMapToolsState()
  const offset = hooks.useOffset(panelOpen)
  const breakpoint = hooks.useBreakpoint()
  const cache = useQueryCache()

  // Down to ONE state prop- `langFeatures`. Hook w/GlobalContext, router?
  const { langFeatures } = state
  const { legendItems } = symbLabelState
  /* eslint-disable operator-linebreak */
  const beforeId = legendItems.length
    ? legendItems[0].legendLabel
    : 'Eastern Africa' // fragile hack for correct draw order of polygon layers
  /* eslint-disable operator-linebreak */

  // Local states
  const [
    geocodeMarker,
    setGeocodeMarker,
  ] = useState<Types.GeocodeMarker | null>()
  const [viewport, setViewport] = useState<Types.ViewportState>(
    config.initialMapState
  )
  const [tooltip, setTooltip] = useState<Types.PopupSettings | null>(null)
  const [popup, setPopup] = useState<Types.PopupSettings | null>(null)
  const [
    clickedBoundary,
    setClickedBoundary,
  ] = useState<Types.BoundaryFeat | null>()

  // Handle MB Boundaries feature click. Had this inside the handler before, but
  // using state and more on-demand-ness seemed more efficient.
  useEffect((): void => {
    // if (!map || !clickedBoundary || !boundariesLookup) return
    if (!map || !clickedBoundary) return

    const boundaryData = cache.getQueryData(
      clickedBoundary.source
    ) as Types.BoundaryLookup[]

    events.handleBoundaryClick(
      map,
      clickedBoundary,
      { width: viewport.width as number, height: viewport.height as number },
      boundaryData,
      offset
    )
  }, [clickedBoundary])

  // Fly to extent of lang features on length change
  useEffect((): void => {
    // At time of writing, a "no features" scenario should only occur on load
    // since "View results..." btn in table is disabled if no records.
    if (!map || !langFeatures.length) return

    // TODO: better check/decouple the fly-home-on-filter-reset behavior so that
    // there are no surprise fly-to-home scenarios.
    if (langFeatures.length === state.langFeatsLenCache) {
      flyHome(map)

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

    const currentLayerNames = legendItems.map((item) => item.legendLabel)

    utils.filterLayersByFeatIDs(
      map,
      currentLayerNames,
      getAllLangFeatIDs(langFeatures)
    )
  }, [langFeatures.length, legendItems])

  // (Re)load symbol icons. Must be done on load and whenever `baselayer` is
  // changed, otherwise the images no longer exist.
  useEffect((): void => {
    if (!mapRef.current) return

    utils.addLangTypeIconsToMap(
      mapRef.current.getMap(),
      config.langTypeIconsConfig
    )
  }, []) // add `baselayer` as dep if using more than just light BG

  // Do selected feature stuff on sel feat change or map load
  useEffect((): void => {
    if (!map || !mapLoaded) return

    // Deselect any language features // TODO: add `selected` key?
    map.removeFeatureState({ source: langSrcID, sourceLayer })
    nuclearClear()

    if (!matchedID) return

    const matchingRecord = findFeatureByID(
      langFeatures,
      parseInt(matchedID, 10)
    )

    if (!matchingRecord) return

    // NOTE: won't get this far on load even if feature is selected. The timing
    // and order of the whole process prevent that.

    const { ID, Latitude: latitude, Longitude: longitude } = matchingRecord
    const settings = {
      latitude,
      longitude,
      zoom: config.POINT_ZOOM_LEVEL,
      disregardCurrZoom: true,
      // bearing: 80, // TODO: consider it as it does add a new element of fancy
      pitch: 80,
      offset,
    }

    // Make feature appear selected // TODO: higher zIndex on selected feature
    map.setFeatureState(
      { sourceLayer, source: langSrcID, id: ID },
      { selected: true }
    )

    utils.flyToPoint(map, settings, utils.prepPopupContent(matchingRecord))
  }, [matchedID, mapLoaded])

  /* eslint-enable react-hooks/exhaustive-deps */

  function onHover(event: Types.MapEvent) {
    if (!mapRef.current || !mapLoaded || !boundariesVisible) return

    events.onHover(event, setTooltip, mapRef.current.getMap(), {
      lang: interactiveLayerIds,
      boundaries: boundariesLayerIDs,
    })
  }

  // TODO: use `if (map.isSourceLoaded('sourceId')` if possible
  // Runs only once and kicks off the whole thing
  function onLoad(mapLoadEvent: MapLoadEvent) {
    // `mapObj` should === `map` but avoid naming conflict just in case:
    const { target: mapObj } = mapLoadEvent
    const idFromUrl = getIDfromURLparams(window.location.search)
    const cacheOfIDs: number[] = [] // TODO: use `reduce` instead of `push`
    const uniqueRecords: LangRecordSchema[] = []

    // This only works because of a very low zoom of 4. Otherwise not all of the
    // features are included. Even 5 in Firefox only makes ~70% of them appear.
    const rawLangFeats = mapObj.querySourceFeatures(langSrcID, { sourceLayer })

    // Just the properties for the table/results, don't need GeoJSON cruft. Also
    // making sure each ID is unique as there were initial data inconsistencies.
    rawLangFeats.forEach((thisFeat) => {
      if (
        !thisFeat.properties ||
        cacheOfIDs.indexOf(thisFeat.properties.ID) !== -1
      ) {
        return
      }

      const justTheProps = thisFeat.properties as LangRecordSchema

      cacheOfIDs.push(justTheProps.ID)
      uniqueRecords.push(thisFeat.properties as LangRecordSchema)
    })

    const matchingRecord = findFeatureByID(uniqueRecords, idFromUrl)

    // NOTE: could not get this into the same `useEffect` that handles when
    // selFeatAttribs or mapLoaded are changed with an MB error/crash.
    if (!matchingRecord) flyHome(mapObj)

    dispatch({ type: 'SET_LANG_LAYER_FEATURES', payload: uniqueRecords })
    setMapLoaded(true)

    // Give MB some well-deserved cred
    mapObj.addControl(
      new AttributionControl({ compact: false }),
      'bottom-right'
    )

    // TODO: put all these init events below into `utils.events.ts`
    // Maintain viewport state sync if needed (e.g. after `flyTo`), otherwise
    // the map shifts back to previous position after panning or zooming.
    mapObj.on('moveend', function onMoveEnd(zoomEndEvent) {
      // No custom event data, regular move event
      if (zoomEndEvent.forceViewportUpdate) {
        setViewport({
          ...viewport, // spreading just in case bearing or pitch are added
          latitude: mapObj.getCenter().lat,
          longitude: mapObj.getCenter().lng,
          pitch: mapObj.getPitch(),
          zoom: mapObj.getZoom(), // bearing: // TODO: consider, looks cool
        })
      }
    })

    // Close popup on the start of moving so no jank
    mapObj.on('movestart', function onMoveStart(zoomEndEvent) {
      if (zoomEndEvent.forceViewportUpdate) nuclearClear()
    })

    mapObj.on('zoomend', function onMoveEnd(customEventData) {
      const {
        popupSettings: popupParams,
        geocodeMarker: geocodeMarkerParams,
      } = customEventData // as MapTypes.CustomEventData // WHYYYY ERRORS

      if (mapObj.isMoving()) return

      setPopup(null)

      if (geocodeMarkerParams) setGeocodeMarker(geocodeMarkerParams)
      if (popupParams as Types.PopupSettings) setPopup(popupParams)
    })
  }

  function onClick(event: Types.MapEvent): void {
    if (!map || !mapLoaded) return

    const topLangFeat = utils.langFeatsUnderClick(event.point, map, {
      lang: interactiveLayerIds,
    })[0]

    nuclearClear() // can't rely on history

    // No language features under the click
    if (!topLangFeat) {
      history.push(loc.pathname)
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })
    } else {
      history.push(`${routes.details}/${topLangFeat.properties?.ID}`)

      return // prevent boundary click underneath
    }

    if (!boundariesVisible) return

    const boundariesClicked = map.queryRenderedFeatures(event.point, {
      layers: boundariesLayerIDs,
    }) as Types.BoundaryFeat[]

    if (!boundariesClicked.length) return

    setClickedBoundary(boundariesClicked[0])
  }

  const nuclearClear = () => {
    setPopup(null)
    setGeocodeMarker(null)
    setTooltip(null)
  }

  const flyHome = (mapObj: MbMap): void => {
    nuclearClear()

    const settings = {
      height: mapObj.getContainer().clientHeight,
      width: mapObj.getContainer().clientWidth,
      bounds: config.initialBounds,
      offset,
    }

    // TODO: prevent errors on resize-while-loading
    utils.flyToBounds(mapObj, settings, null)
  }

  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!map || !mapLoaded) return

    if (actionID === 'home') {
      flyHome(map)
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
      map.zoomIn({ offset }, popup || undefined)
    } else if (actionID === 'out') {
      map.zoomOut({ offset }, popup || undefined)
    }
  }

  return (
    <>
      <MapGL
        {...viewport}
        {...config.mapProps}
        ref={mapRef}
        interactiveLayerIds={
          boundariesVisible
            ? [...boundariesLayerIDs, ...interactiveLayerIds]
            : [...interactiveLayerIds]
        }
        onViewportChange={setViewport}
        onClick={(event: Types.MapEvent) => onClick(event)}
        onHover={onHover}
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
        {symbLayers && <LangMbSrcAndLayer symbLayers={symbLayers} />}
        {popup && <MapPopup {...popup} setVisible={() => setPopup(null)} />}
        {/* Popups are annoying on mobile */}
        {!isTouchEnabled() && tooltip && (
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
