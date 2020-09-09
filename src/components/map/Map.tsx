import React, { FC, useState, useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useTheme } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router-dom'
import {
  AttributionControl,
  Map as MbMap,
  setRTLTextPlugin,
  VectorSource,
  LngLatBoundsLike,
} from 'mapbox-gl'
import MapGL, {
  InteractiveMap,
  MapLoadEvent,
  ViewportProps,
  ViewState,
} from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { initLegend } from 'components/legend/utils'
import { paths as routes } from 'components/config/routes'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { MapPopup } from './MapPopup'
import { MapCtrlBtns } from './MapCtrlBtns'
import { BoundariesLayer } from './BoundariesLayer'
import { GeocodeMarker } from './GeocodeMarker'

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

export const Map: FC<MapTypes.MapComponent> = (props) => {
  const { symbLayers, labelLayers, baselayer } = props
  const history = useHistory()
  const loc = useLocation()
  const { state, dispatch } = useContext(GlobalContext)
  const theme = useTheme()
  const mapRef: React.RefObject<InteractiveMap> = React.useRef(null)
  const { width } = useWindowResize() // TODO: use viewport?
  const [isDesktop, setIsDesktop] = useState<boolean>(
    width >= theme.breakpoints.values.md
  )

  const { selFeatAttribs, mapLoaded, activeLangSymbGroupId } = state

  // Local states
  const [
    geocodeMarker,
    setGeocodeMarker,
  ] = useState<MapTypes.GeocodeMarker | null>()
  const [viewport, setViewport] = useState<Partial<ViewportProps> & ViewState>(
    config.initialMapState
  )
  const [
    tooltipSettings,
    setTooltipSettings,
  ] = useState<MapTypes.PopupSettings | null>(null)
  const [
    popupSettings,
    setPopupSettings,
  ] = useState<MapTypes.PopupSettings | null>(null)

  // Lookup tables // TODO: into <Boundaries> somehow. Not needed on load!
  const lookups = {
    counties: useQuery<MapTypes.BoundaryLookup[]>(countiesConfig.source.id)
      .data,
    neighborhoods: useQuery<MapTypes.BoundaryLookup[]>(neighbConfig.source.id)
      .data,
  }

  const interactiveLayerIds = React.useMemo(
    () => symbLayers.map((symbLayer) => symbLayer.id),
    [symbLayers]
  )

  /* eslint-disable react-hooks/exhaustive-deps */
  // ^^^^^ otherwise it wants things like mapRef and dispatch 24/7

  useEffect((): void => {
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()
    const currentLayerNames = state.legendItems.map((item) => item.legendLabel)

    utils.filterLayersByFeatIDs(map, currentLayerNames, state.langFeatIDs)
  }, [state.langFeatIDs])

  // TODO: put in... legend?
  useEffect(
    (): void => initLegend(dispatch, activeLangSymbGroupId, symbLayers),
    [activeLangSymbGroupId]
  )

  // On width change, determine whether or not the view is desktop
  useEffect((): void => {
    setIsDesktop(width >= theme.breakpoints.values.md)
  }, [width])

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
    // TODO: add `selected` key?
    map.removeFeatureState({ source: langSrcID, sourceLayer })

    nuclearClear()

    if (!selFeatAttribs) return

    // NOTE: won't get this far on load even if feature is selected. The timing
    // and order of the whole process prevent that.

    const { ID, Latitude: latitude, Longitude: longitude } = selFeatAttribs
    const settings = { latitude, longitude, zoom: 14, disregardCurrZoom: true }

    // Make feature appear selected // TODO: higher zIndex on selected feature
    map.setFeatureState(
      { sourceLayer, source: langSrcID, id: ID },
      { selected: true }
    )

    // TODO: make popups on mobile not off-center
    utils.flyToPoint(map, settings, utils.prepPopupContent(selFeatAttribs))
  }, [selFeatAttribs, mapLoaded])
  /* eslint-enable react-hooks/exhaustive-deps */

  function onHover(event: MapTypes.MapEvent) {
    if (!mapRef.current || !mapLoaded) return

    events.onHover(event, setTooltipSettings, mapRef.current.getMap(), {
      lang: interactiveLayerIds,
      boundaries: boundariesLayerIDs,
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
      uniqueRecords.push(thisFeat.properties as LangRecordSchema)
    })

    const matchingRecord = findFeatureByID(uniqueRecords, idFromUrl)

    // NOTE: could not get this into the same `useEffect` that handles when
    // selFeatAttribs or mapLoaded are changed with an MB error/crash.
    if (!matchingRecord) flyHome(map)

    // TODO: set paint property
    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

    dispatch({ type: 'SET_MAP_LOADED', payload: true })
    dispatch({ type: 'INIT_LANG_LAYER_FEATURES', payload: uniqueRecords })

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
          latitude: map.getCenter().lat,
          longitude: map.getCenter().lng,
          zoom: map.getZoom(),
        })
      }
    })

    // Close popup on the start of moving so no jank
    map.on('movestart', function onMoveStart(zoomEndEvent) {
      if (zoomEndEvent.forceViewportUpdate) nuclearClear()
    })

    map.on('zoomend', function onMoveEnd(customEventData) {
      const {
        popupSettings: popupParams,
        geocodeMarker: geocodeMarkerParams,
      } = customEventData // as MapTypes.CustomEventData // WHYYYY ERRORS

      if (map.isMoving()) return

      setPopupSettings(null)

      if (geocodeMarkerParams) setGeocodeMarker(geocodeMarkerParams)

      if (popupParams as MapTypes.PopupSettings) {
        setPopupSettings(popupParams)
      }
    })
  }

  function onClick(event: MapTypes.MapEvent): void {
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()
    const topLangFeat = utils.langFeatsUnderClick(event.point, map, {
      lang: interactiveLayerIds,
    })[0]

    nuclearClear() // can't rely on history

    // No language features under the click
    if (!topLangFeat) {
      history.push(loc.pathname)
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })
    } else {
      const langFeat = topLangFeat as MapTypes.LangFeature

      // TODO: use `initialEntries` in <MemoryRouter> to test routing
      history.push(`${routes.details}?id=${langFeat.properties.ID}`)

      return // prevent boundary click underneath
    }

    if (!state.boundariesLayersVisible) return

    const boundariesClicked = map.queryRenderedFeatures(event.point, {
      layers: boundariesLayerIDs,
    }) as MapTypes.BoundaryFeat[]

    if (boundariesClicked.length) {
      const dimensions = {
        width: viewport.width as number,
        height: viewport.height as number,
      }
      const lookup =
        lookups[boundariesClicked[0].source as 'neighborhoods' | 'counties']

      events.handleBoundaryClick(map, boundariesClicked[0], dimensions, lookup)
    }
  }

  const nuclearClear = () => {
    setPopupSettings(null)
    setGeocodeMarker(null)
    setTooltipSettings(null)
  }

  const flyHome = (map: MbMap): void => {
    nuclearClear()

    const settings = {
      height: map.getContainer().clientHeight,
      width: map.getContainer().clientWidth,
      bounds: config.initialBounds,
      padding: 25,
    }

    utils.flyToBounds(map, settings, null)
  }

  // TODO: into utils if it doesn't require passing 1000 args
  function onMapCtrlClick(actionID: MapTypes.MapControlAction) {
    if (!mapRef.current) return

    const map: MbMap = mapRef.current.getMap()

    if (actionID === 'info') {
      dispatch({ type: 'TOGGLE_OFF_CANVAS_NAV' })
    } else if (actionID === 'home') {
      flyHome(map)
    } else {
      // Assumes `in` or `out` from here down...
      const { zoom } = viewport

      utils.flyToPoint(
        map,
        { ...viewport, zoom: actionID === 'in' ? zoom + 1 : zoom - 1 },
        utils.prepPopupContent(
          selFeatAttribs,
          popupSettings ? popupSettings.heading : null
        )
      )
    }
  }

  return (
    <>
      <MapGL
        {...viewport}
        {...config.mapProps}
        ref={mapRef}
        interactiveLayerIds={boundariesLayerIDs.concat(
          interactiveLayerIds || []
        )}
        onViewportChange={setViewport}
        onClick={(event: MapTypes.MapEvent) => onClick(event)}
        onHover={onHover}
        onLoad={(mapLoadEvent) => onLoad(mapLoadEvent)}
      >
        {geocodeMarker && <GeocodeMarker {...geocodeMarker} />}
        {[neighbConfig, countiesConfig].map((boundaryConfig) => (
          <BoundariesLayer
            key={boundaryConfig.source.id}
            {...boundaryConfig}
            visible={state.boundariesLayersVisible}
            beforeId={
              state.legendItems.length ? state.legendItems[0].legendLabel : ''
            }
          />
        ))}
        {symbLayers && labelLayers && (
          <LangMbSrcAndLayer
            {...{ symbLayers, labelLayers }}
            activeLangSymbGroupId={activeLangSymbGroupId}
            activeLangLabelId={state.activeLangLabelId}
          />
        )}
        {popupSettings && (
          <MapPopup
            {...popupSettings}
            setVisible={() => setPopupSettings(null)}
          />
        )}
        {/* BAD CHECK, should be checking for touch capabilities */}
        {isDesktop && tooltipSettings && (
          <MapPopup
            {...tooltipSettings}
            setVisible={() => setTooltipSettings(null)}
          />
        )}
      </MapGL>
      <MapCtrlBtns
        {...{ mapRef }}
        onMapCtrlClick={(actionID: MapTypes.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </>
  )
}
