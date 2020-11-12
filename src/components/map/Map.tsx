import React, { FC, useState, useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
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

import { GlobalContext } from 'components/context'
import { paths as routes } from 'components/config/routes'
import { useSymbAndLabelState } from 'components/context/SymbAndLabelContext'
import { LangRecordSchema } from 'components/context/types'
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
  const {
    boundariesVisible,
    geolocActive,
    mapLoaded,
    mapRef,
    panelOpen,
    setMapLoaded,
  } = props

  // Routing
  const history = useHistory()
  const loc = useLocation()
  const match: { params: { id: string } } | null = useRouteMatch('/details/:id')
  const matchedFeatID = match?.params?.id

  const { state, dispatch } = useContext(GlobalContext)
  const symbLabelState = useSymbAndLabelState()
  const offset = hooks.useOffset(panelOpen)
  const breakpoint = hooks.useBreakpoint()

  // Down to ONE state prop- `langFeatures`. Hook w/GlobalContext, router?
  const { langFeatures } = state
  const { legendItems } = symbLabelState

  // Local states
  const [
    geocodeMarker,
    setGeocodeMarker,
  ] = useState<Types.GeocodeMarker | null>()
  const [viewport, setViewport] = useState<Types.ViewportState>(
    config.initialMapState
  )
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
    // since "View results..." btn in table is disabled if no records.
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
        offset,
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
      offset,
    }

    // Make feature appear selected // TODO: higher zIndex on selected feature
    map.setFeatureState(
      { sourceLayer, source: langSrcID, id: ID },
      { selected: true }
    )

    utils.flyToPoint(map, settings, utils.prepPopupContent(matchingRecord))
  }, [matchedFeatID, mapLoaded])

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

    // This only works because of a very low zoom of 4. Otherwise not all of the
    // features are included. Even 5 in Firefox only makes ~70% of them appear.
    const rawLangFeats = map.querySourceFeatures(langSrcID, { sourceLayer })

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
    if (!matchingRecord) flyHome(map)

    dispatch({ type: 'SET_LANG_LAYER_FEATURES', payload: uniqueRecords })
    setMapLoaded(true)

    // Give MB some well-deserved cred
    map.addControl(new AttributionControl({ compact: false }), 'bottom-right')

    // TODO: put all these init events below into `utils.events.ts`
    // Maintain viewport state sync if needed (e.g. after `flyTo`), otherwise
    // the map shifts back to previous position after panning or zooming.
    map.on('moveend', function onMoveEnd(zoomEndEvent) {
      // No custom event data, regular move event
      if (zoomEndEvent.forceViewportUpdate) {
        setViewport({
          ...viewport, // spreading just in case bearing or pitch are added
          latitude: map.getCenter().lat,
          longitude: map.getCenter().lng,
          pitch: map.getPitch(),
          zoom: map.getZoom(), // bearing: // TODO: consider, looks cool
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
      if (popupParams as Types.PopupSettings) setPopupSettings(popupParams)
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
      history.push(`${routes.details}/${topLangFeat.properties?.ID}`)

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

      events.handleBoundaryClick(
        map,
        boundariesClicked[0],
        dimensions,
        lookup,
        offset
      )
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
      offset,
    }

    utils.flyToBounds(map, settings, null)
  }

  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!mapRef.current) return

    const map: MbMap = mapRef.current.getMap()

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
      map.zoomIn({ offset }, popupSettings || undefined)
    } else if (actionID === 'out') {
      map.zoomOut({ offset }, popupSettings || undefined)
    }
  }

  return (
    <>
      <MapGL
        {...viewport}
        {...config.mapProps}
        ref={mapRef}
        interactiveLayerIds={[...boundariesLayerIDs, ...interactiveLayerIds]}
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
            setViewport({ ...mapViewport, zoom: config.POINT_ZOOM_LEVEL })
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
        isPitchZero={viewport.pitch === 0}
        onMapCtrlClick={(actionID: Types.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </>
  )
}
