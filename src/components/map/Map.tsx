import React, { FC, useState, useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'
import {
  AttributionControl,
  Map as MbMap,
  setRTLTextPlugin,
  VectorSource,
  LngLatBoundsLike,
} from 'mapbox-gl'
import MapGL, {
  WebMercatorViewport,
  Marker,
  InteractiveMap,
  MapLoadEvent,
} from 'react-map-gl'
import { IoIosPin } from 'react-icons/io'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { initLegend } from 'components/legend/utils'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { MapPopup } from './MapPopup'
import { MapTooltip } from './MapTooltip'
import { MapCtrlBtns } from './MapCtrlBtns'
import { BoundariesLayer } from './BoundariesLayer'

import * as MapTypes from './types'
import * as utils from './utils'
import * as config from './config'
import * as events from './events'

import { LangRecordSchema } from '../../context/types'
import {
  getIDfromURLparams,
  findFeatureByID,
  useWindowResize,
} from '../../utils'

const { layerId: sourceLayer, langSrcID } = config.mbStyleTileConfig
const { neighbConfig, countiesConfig, boundariesLayerIDs } = config
const neighSrcId = neighbConfig.source.id
const countiesSrcId = countiesConfig.source.id

// Jest or whatever CANNOT find this plugin. And importing it from
// `react-map-gl` is useless as well.
if (typeof window !== undefined && typeof setRTLTextPlugin === 'function') {
  // Ensure right-to-left languages (Arabic, Hebrew) are shown correctly
  setRTLTextPlugin(
    // latest version: https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    // Yeah not today TS, thanks anyway:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    (error): Error => error, // supposed to be an error-handling function
    true // lazy: only load when the map first encounters Hebrew or Arabic text
  )
}

export const Map: FC<MapTypes.MapComponent> = (props) => {
  const { symbLayers, labelLayers, baselayer, mapWrapClassName } = props
  const history = useHistory()
  const loc = useLocation()
  const { state, dispatch } = useContext(GlobalContext)
  const { width, height } = useWindowResize() // TODO: use viewport?
  const [isDesktop] = useState<boolean>(false)

  const mapRef: React.RefObject<InteractiveMap> = React.useRef(null)
  const { selFeatAttribs, mapLoaded } = state
  const [viewport, setViewport] = useState(config.initialMapState)
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [
    popupSettings,
    setPopupSettings,
  ] = useState<MapTypes.PopupSettings | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState<MapTypes.MapTooltip | null>(
    null
  )
  const [geocodeMarker, setGeocodeMarker] = useState<null | {
    longitude: number
    latitude: number
  }>()
  const lookups = {
    counties: useQuery<MapTypes.MbBoundaryLookup[]>(countiesSrcId).data,
    neighborhoods: useQuery<MapTypes.MbBoundaryLookup[]>(neighSrcId).data,
  }

  const interactiveLayerIds = React.useMemo(
    () => symbLayers.map((symbLayer) => symbLayer.id),
    [symbLayers]
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  // ^^^^^ otherwise it wants things like mapRef and dispatch 24/7

  // TODO: another file
  useEffect((): void => {
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()
    const currentLayerNames = state.legendItems.map((item) => item.legendLabel)

    utils.filterLayersByFeatIDs(map, currentLayerNames, state.langFeatIDs)
  }, [state.langFeatIDs])

  // TODO: put in... legend?
  useEffect((): void => {
    initLegend(dispatch, state.activeLangSymbGroupId, symbLayers)
  }, [state.activeLangSymbGroupId])

  // (Re)load symbol icons. Must be done whenever `baselayer` is changed,
  // otherwise the images no longer exist.
  // TODO: rm if no longer using. Currently experiencing tons of issues with
  // custom styles vs. default MB in terms of fonts/glyps and icons/images
  useEffect((): void => {
    if (mapRef.current) {
      const map: MbMap = mapRef.current.getMap()
      utils.addLangTypeIconsToMap(map, config.langTypeIconsConfig)
    }
  }, [baselayer]) // baselayer may be irrelevant if only using Light BG

  // Do selected feature stuff on sel feat change or map load
  useEffect((): void => {
    // Map not ready
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()

    // Deselect any language features
    clearAllSelFeats(map)
    setTooltipOpen(null) // super annoying if tooltip stays intact after a click
    setPopupVisible(false) // closed by movestart anyway, but smoother this way}

    if (!selFeatAttribs) return

    // NOTE: won't get this far on load even if feature is selected. The timing
    // and order of the whole process prevent that. Make feature appear selected

    const { ID, Latitude, Longitude } = selFeatAttribs

    setSelFeatState(map, ID, true)
    // TODO: make this a thing again: `disregardCurrZoom: true`

    map.flyTo(
      {
        essential: true,
        zoom: 14,
        center: { lon: Longitude, lat: Latitude },
      },
      {
        forceViewportUpdate: true,
        /* eslint-disable operator-linebreak */
        popupSettings: popupVisible
          ? { Latitude, Longitude, ...getPopupContent() }
          : null,
        /* eslint-enable operator-linebreak */
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selFeatAttribs, mapLoaded])

  // TODO: higher zIndex on selected feature
  function setSelFeatState(map: MbMap, id: number, selected: boolean) {
    map.setFeatureState({ sourceLayer, source: langSrcID, id }, { selected })
  }

  function onHover(event: MapTypes.MapEvent) {
    if (!mapRef.current || !mapLoaded) return

    events.onHover(event, setTooltipOpen, mapRef.current.getMap(), {
      lang: interactiveLayerIds,
      boundaries: [], // state.boundariesLayerVisible ? boundariesLayerIDs : [],
    })
  }

  // Runs only once and kicks off the whole thinig
  function onLoad(mapLoadEvent: MapLoadEvent) {
    const { target: map } = mapLoadEvent

    const langSrc = map.getSource('languages-src') as VectorSource
    const langSrcBounds = langSrc.bounds as LngLatBoundsLike
    const idFromUrl = getIDfromURLparams(window.location.search)
    const cacheOfIDs: number[] = []
    const uniqueRecords: LangRecordSchema[] = []
    const rawLangFeats = map.querySourceFeatures(langSrcID, { sourceLayer })

    // TODO: start from actual layer bounds somehow, then zoom is not needed.
    map.fitBounds(langSrcBounds) // ensure all feats are visible.

    // Just the properties for table/results, don't need GeoJSON cruft. Also
    // need to make sure each ID is unique as there have been initial data
    // inconsistencies, and more importantly MB may have feature duplication if
    // there is a tile overlap.
    rawLangFeats.forEach((thisFeat) => {
      if (
        !thisFeat.properties ||
        cacheOfIDs.indexOf(thisFeat.properties.ID) !== -1
      ) {
        return
      }

      const justTheProps = thisFeat.properties as LangRecordSchema

      cacheOfIDs.push(justTheProps.ID)
      uniqueRecords.push(justTheProps)
    })

    const matchingRecord = findFeatureByID(uniqueRecords, idFromUrl)

    // NOTE: could not get this into the same `useEffect` that handles when
    // selFeatAttribs or mapLoaded are changed with an MB error/crash.
    if (!matchingRecord) flyHome()

    // TODO: set paint property
    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

    dispatch({ type: 'INIT_LANG_LAYER_FEATURES', payload: uniqueRecords })
    dispatch({ type: 'SET_MAP_LOADED', payload: true })

    // Give MB some well-deserved cred
    map.addControl(new AttributionControl({ compact: false }), 'bottom-right')

    // TODO: put all these init events below into `utils.events.ts`

    // Maintain viewport state sync if needed (e.g. after things like `flyTo`),
    // otherwise the map shifts back to previous position after panning or
    // zooming.
    map.on('moveend', function onMoveEnd(zoomEndEvent) {
      // No custom event data, regular move event
      if (zoomEndEvent.forceViewportUpdate) {
        setViewport({
          ...viewport, // spreading just in case bearing or pitch are added
          zoom: map.getZoom(),
          latitude: map.getCenter().lat,
          longitude: map.getCenter().lng,
        })
      }
    })

    // Close popup on the start of moving so no jank
    map.on('movestart', function onMoveStart(zoomEndEvent) {
      if (zoomEndEvent.geocodeMarkerLatLon) setGeocodeMarker(null)
      if (zoomEndEvent.popupSettings) setPopupVisible(false)
    })

    map.on('zoomend', function onMoveEnd(customEventData) {
      const {
        popupSettings: popupParams,
        geocodeMarkerLatLon,
      } = customEventData

      if (map.isMoving()) return

      if (popupParams) {
        setPopupVisible(true)
        setPopupSettings(popupParams)
      }

      if (geocodeMarkerLatLon) {
        setGeocodeMarker(geocodeMarkerLatLon)
      }
    })
  }

  function onClick(event: MapTypes.MapEvent): void {
    if (!mapRef.current || !mapLoaded) return

    setGeocodeMarker(null) // clear geocoder marker

    const map: MbMap = mapRef.current.getMap()
    const topLangFeat = utils.langFeatsUnderClick(event.point, map, {
      lang: interactiveLayerIds,
    })[0]

    // Nothing under the click, or nothing we care about
    // if (!topFeat || !sourcesToCheck.includes(topFeat.source)) {
    if (!topLangFeat) {
      history.push(loc.pathname)

      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })
    } else {
      const langFeat = topLangFeat as MapTypes.LangFeature
      const DETAILS_PATH = '/details' as MapTypes.RouteLocation

      // TODO: use `initialEntries` in <MemoryRouter> to test routing
      history.push(`${DETAILS_PATH}?id=${langFeat.properties.ID}`)

      return // prevent boundary click underneath
    }

    if (!state.boundariesLayerVisible) return

    const boundariesClicked = map.queryRenderedFeatures(event.point, {
      layers: boundariesLayerIDs,
    }) as MapTypes.BoundaryFeat[]

    if (boundariesClicked.length) {
      const boundsConfig = { width, height, isDesktop }
      const lookup =
        lookups[boundariesClicked[0].source as 'neighborhoods' | 'counties']

      events.handleBoundaryClick(
        map,
        boundariesClicked[0],
        boundsConfig,
        lookup
      )
    }
  }

  // Assumes map is ready
  function clearAllSelFeats(map: MbMap) {
    // TODO: add `selected` key?
    map.removeFeatureState({ source: langSrcID, sourceLayer })
  }

  function flyHome() {
    if (!mapRef.current) return

    const map: MbMap = mapRef.current.getMap()
    const padding = isDesktop ? 50 : 10
    const webMercViewport = new WebMercatorViewport({
      width,
      height,
    }).fitBounds(config.initialBounds, { padding })

    const { latitude, longitude, zoom } = webMercViewport

    map.flyTo(
      {
        essential: true,
        zoom,
        center: { lon: longitude, lat: latitude },
      },
      {
        forceViewportUpdate: true,
        /* eslint-disable operator-linebreak */
        popupSettings: popupVisible
          ? { latitude, longitude, ...getPopupContent() }
          : null,
        /* eslint-enable operator-linebreak */
      }
    )
  }

  function getPopupContent() {
    const content = utils.prepPopupContent(
      selFeatAttribs,
      popupSettings ? popupSettings.heading : null
    )

    if (content) {
      return { heading: content.heading, subheading: content.subheading }
    }

    return null
  }

  // TODO: into utils if it doesn't require passing 1000 args
  function onMapCtrlClick(actionID: MapTypes.MapControlAction) {
    if (!mapRef.current) return

    if (actionID === 'info') {
      dispatch({ type: 'TOGGLE_OFF_CANVAS_NAV' })
    } else if (actionID === 'home') {
      flyHome()
    } else {
      // Assumes `in` or `out` from here down...

      const map: MbMap = mapRef.current.getMap()
      const { zoom, latitude, longitude } = viewport

      map.flyTo(
        {
          essential: true,
          zoom: actionID === 'in' ? zoom + 1 : zoom - 1,
          center: { lon: longitude, lat: latitude },
        },
        {
          forceViewportUpdate: true,
          /* eslint-disable operator-linebreak */
          popupSettings: popupVisible
            ? { latitude, longitude, ...getPopupContent() }
            : null,
          /* eslint-enable operator-linebreak */
        }
      )
    }
  }

  return (
    <div className={mapWrapClassName}>
      <MapGL
        {...viewport}
        {...config.mapProps}
        ref={mapRef}
        interactiveLayerIds={boundariesLayerIDs.concat(
          (state.boundariesLayerVisible && interactiveLayerIds) || []
        )}
        onViewportChange={setViewport}
        onClick={(event: MapTypes.MapEvent) => onClick(event)}
        onHover={onHover}
        onLoad={(mapLoadEvent) => onLoad(mapLoadEvent)}
      >
        {geocodeMarker && (
          <Marker {...geocodeMarker} className="geocode-marker">
            <IoIosPin />
          </Marker>
        )}
        {/* TODO: put back */}
        {symbLayers && state.boundariesLayerVisible && (
          <>
            {[neighbConfig, countiesConfig].map((boundaryConfig) => (
              <BoundariesLayer
                key={boundaryConfig.source.id}
                {...boundaryConfig}
                beforeId={
                  /* eslint-disable operator-linebreak */
                  state.legendItems.length
                    ? state.legendItems[0].legendLabel
                    : ''
                  /* eslint-enable operator-linebreak */
                }
              />
            ))}
          </>
        )}
        {symbLayers && labelLayers && (
          <LangMbSrcAndLayer
            {...{ symbLayers, labelLayers }}
            activeLangSymbGroupId={state.activeLangSymbGroupId}
            activeLangLabelId={state.activeLangLabelId}
          />
        )}
        {popupVisible && popupSettings && (
          <MapPopup {...popupSettings} setPopupVisible={setPopupVisible} />
        )}
        {isDesktop && tooltipOpen && (
          <MapTooltip setTooltipOpen={setTooltipOpen} {...tooltipOpen} />
        )}
      </MapGL>
      <MapCtrlBtns
        {...{ mapRef, isDesktop }}
        onMapCtrlClick={(actionID: MapTypes.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </div>
  )
}
