import React, { FC, useState, useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import {
  AttributionControl,
  Map as MbMap,
  setRTLTextPlugin,
  LngLatBounds,
} from 'mapbox-gl'
import MapGL, { InteractiveMap, MapLoadEvent } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'
import { useSymbAndLabelState } from '../../context/SymbAndLabelContext'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { Geolocation } from './Geolocation'
import { MapPopup } from './MapPopup'
import { MapCtrlBtns } from './MapCtrlBtns'
import { BoundariesLayer } from './BoundariesLayer'
import { GeocodeMarker } from './GeocodeMarker'

import * as Types from './types'
import * as utils from './utils'
import * as hooks from './hooks'
import * as config from './config'
import * as events from './events'
import symbLayers from './config.lang-style'

import { LangRecordSchema } from '../../context/types'
import {
  getIDfromURLparams,
  findFeatureByID,
  getAllLangFeatIDs,
  isTouchEnabled,
} from '../../utils'

type MapProps = {
  openOffCanvasNav: () => void
  mapLoaded: boolean
  setMapLoaded: React.Dispatch<boolean>
  panelClosed?: boolean
}

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

export const Map: FC<MapProps> = (props) => {
  const { openOffCanvasNav, mapLoaded, setMapLoaded, panelClosed } = props
  const history = useHistory()
  const loc = useLocation()
  const match: { params: { id: string } } | null = useRouteMatch('/details/:id')
  const matchedFeatID = match?.params?.id
  const { state, dispatch } = useContext(GlobalContext)
  const symbLabelState = useSymbAndLabelState()
  const mapRef: React.RefObject<InteractiveMap> = React.useRef(null)
  const { left, top } = hooks.usePadding(panelClosed)
  const [boundariesVisible, setBoundariesVisible] = useState<boolean>(false)
  const [geolocActive, setGeolocActive] = useState<boolean>(false)
  const initialViewport = hooks.useInitialViewport({
    ...config.initialMapState,
    bounds: config.initialBounds,
    padding: { left, top, right: 0, bottom: 0 },
  })

  // TODO: don't get `selFeatAttribs` from state, instead reuse a util or make a
  // hook for setting this locally whenever `matchedFeatID` changes. Then we're
  // down to just ONE state property- `langFeatures`, which may be here forever.
  const { selFeatAttribs, langFeatures } = state
  const { legendItems } = symbLabelState

  // Local states
  const [
    geocodeMarker,
    setGeocodeMarker,
  ] = useState<Types.GeocodeMarker | null>()
  const [viewport, setViewport] = useState<Types.ViewportState>(initialViewport)
  const [
    tooltipSettings,
    setTooltipSettings,
  ] = useState<Types.PopupSettings | null>(null)
  const [
    popupSettings,
    setPopupSettings,
  ] = useState<Types.PopupSettings | null>(null)

  // Lookup tables // TODO: into <Boundaries> somehow. Not needed on load!
  const lookups = {
    counties: useQuery<Types.BoundaryLookup[]>(countiesConfig.source.id).data,
    neighborhoods: useQuery<Types.BoundaryLookup[]>(neighbConfig.source.id)
      .data,
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  // ^^^^^ otherwise it wants things like mapRef and dispatch 24/7

  // Fly to extent of lang features on length change
  useEffect((): void => {
    if (!mapRef.current) return

    const map: MbMap = mapRef.current.getMap()

    // At time of writing, a "no features" scenario should only occur on load
    // since the "View results..." btn in the table is disabled if there are no
    // records.
    if (!langFeatures.length) return

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
      const settings = {
        latitude: firstCoords[1],
        longitude: firstCoords[0],
        zoom: config.POINT_ZOOM_LEVEL,
        pitch: 80,
      }

      utils.flyToPoint(map, settings, null)

      return
    }

    const bounds = langFeatures.reduce(
      (all, thisOne) => all.extend([thisOne.Longitude, thisOne.Latitude]),
      new LngLatBounds(firstCoords, firstCoords)
    )

    utils.flyToBounds(
      map,
      {
        height: viewport.height as number,
        width: viewport.width as number,
        bounds: bounds.toArray() as Types.BoundsArray,
      },
      null
    )
  }, [langFeatures.length])

  // Filter lang feats in map on length change or symbology change
  useEffect((): void => {
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()
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
    if (mapRef.current) {
      const map: MbMap = mapRef.current.getMap()
      utils.addLangTypeIconsToMap(map, config.langTypeIconsConfig)
    }
  }, []) // add `baselayer` as dep if using more than just light BG

  // Do selected feature stuff on sel feat change or map load
  useEffect((): void => {
    // Map not ready
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()

    // Deselect any language features // TODO: add `selected` key?
    map.removeFeatureState({ source: langSrcID, sourceLayer })

    nuclearClear()

    if (!matchedFeatID) return

    const matchingRecord = findFeatureByID(
      state.langFeatures,
      parseInt(matchedFeatID, 10)
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
    }

    // Make feature appear selected // TODO: higher zIndex on selected feature
    map.setFeatureState(
      { sourceLayer, source: langSrcID, id: ID },
      { selected: true }
    )

    // TODO: make popups on mobile not off-center
    utils.flyToPoint(map, settings, utils.prepPopupContent(matchingRecord))
  }, [matchedFeatID, mapLoaded])

  useEffect(() => {
    // `undefined` initially, so shouldn't trigger anything
    if (!mapRef?.current || !mapLoaded || panelClosed === undefined) return

    mapRef.current.getMap().panBy([left, top], undefined, {
      forceViewportUpdate: true,
      popupSettings: { heading: 'sure', subheading: 'yeah' },
    })
  }, [panelClosed])
  /* eslint-enable react-hooks/exhaustive-deps */

  function onHover(event: Types.MapEvent) {
    if (!mapRef.current || !mapLoaded) return

    events.onHover(event, setTooltipSettings, mapRef.current.getMap(), {
      lang: interactiveLayerIds,
      boundaries: boundariesLayerIDs,
    })
  }

  // Runs only once and kicks off the whole thing
  function onLoad(mapLoadEvent: MapLoadEvent) {
    const { target: map } = mapLoadEvent
    const idFromUrl = getIDfromURLparams(window.location.search)
    const cacheOfIDs: number[] = []
    const uniqueRecords: LangRecordSchema[] = []

    // NOTE: this only works because a very low zoom of 4 is set. Otherwise not
    // all of the features are included. Even changing it to 5 in Firefox only
    // makes ~70% of them appear.
    const rawLangFeats = map.querySourceFeatures(langSrcID, { sourceLayer })

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
    if (!matchingRecord) flyHome(map, true) // TODO: rm if not using `true`, etc

    // TODO: set paint property
    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

    dispatch({ type: 'SET_LANG_LAYER_FEATURES', payload: uniqueRecords })
    setMapLoaded(true)

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
          pitch: map.getPitch(),
          zoom: map.getZoom(),
          // bearing: map.getBearing(), // TODO: consider, looks cool
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

      if (popupParams as Types.PopupSettings) {
        setPopupSettings(popupParams)
      }
    })
  }

  function onClick(event: Types.MapEvent): void {
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
      const langFeat = topLangFeat as Types.LangFeature

      history.push(`${routes.details}/${langFeat.properties.ID}`)

      return // prevent boundary click underneath
    }

    if (!boundariesVisible) return

    const boundariesClicked = map.queryRenderedFeatures(event.point, {
      layers: boundariesLayerIDs,
    }) as Types.BoundaryFeat[]

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

  const flyHome = (map: MbMap, initial?: boolean): void => {
    nuclearClear()

    const settings = {
      height: map.getContainer().clientHeight,
      width: map.getContainer().clientWidth,
      bounds: config.initialBounds,
      padding: 25,
    }

    // if (initial) {
    //   settings = {
    //     ...settings,
    //     ...initialViewport,
    //   }
    // }

    utils.flyToBounds(map, settings, null)
  }

  // TODO: into utils if it doesn't require passing 1000 args
  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!mapRef.current) return

    const map: MbMap = mapRef.current.getMap()

    if (actionID === 'info') {
      openOffCanvasNav()
    } else if (actionID === 'home') {
      flyHome(map)
    } else {
      // TODO: consider a simple zoom in/out if it's easier:
      // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#zoomin
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
        onClick={(event: Types.MapEvent) => onClick(event)}
        onHover={onHover}
        onLoad={(mapLoadEvent) => onLoad(mapLoadEvent)}
      >
        <Geolocation
          active={geolocActive}
          onViewportChange={(mapViewport: Types.ViewportState) => {
            // CRED:
            // github.com/visgl/react-map-gl/issues/887#issuecomment-531580394
            setViewport({
              ...mapViewport,
              zoom: config.POINT_ZOOM_LEVEL,
            })
          }}
        />
        {geocodeMarker && <GeocodeMarker {...geocodeMarker} />}
        {[neighbConfig, countiesConfig].map((boundaryConfig) => (
          <BoundariesLayer
            key={boundaryConfig.source.id}
            {...boundaryConfig}
            visible={boundariesVisible}
            beforeId={legendItems.length ? legendItems[0].legendLabel : ''}
          />
        ))}
        {symbLayers && <LangMbSrcAndLayer symbLayers={symbLayers} />}
        {popupSettings && (
          <MapPopup
            {...popupSettings}
            setVisible={() => setPopupSettings(null)}
          />
        )}
        {/* Popups are annoying on mobile */}
        {!isTouchEnabled() && tooltipSettings && (
          <MapPopup
            {...tooltipSettings}
            setVisible={() => setTooltipSettings(null)}
          />
        )}
      </MapGL>
      <MapCtrlBtns
        mapRef={mapRef}
        geolocActive={geolocActive}
        setGeolocActive={setGeolocActive}
        boundariesVisible={boundariesVisible}
        setBoundariesVisible={setBoundariesVisible}
        handlePitchReset={() => setViewport({ ...viewport, pitch: 0 })}
        isPitchZero={viewport.pitch === 0}
        onMapCtrlClick={(actionID: Types.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </>
  )
}
