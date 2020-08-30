import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AttributionControl, Map as MbMap, setRTLTextPlugin } from 'mapbox-gl'
import MapGL, { InteractiveMap, MapLoadEvent } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext, LoadingBackdrop } from 'components'
import { initLegend } from 'components/legend/utils'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { MapPopup } from './MapPopup'
import { MapTooltip } from './MapTooltip'
import { MapCtrlBtns } from './MapCtrlBtns'
import * as MapTypes from './types'
import * as mapUtils from './utils'
import * as mapConfig from './config'
import { LangRecordSchema } from '../../context/types'
import {
  getIDfromURLparams,
  findFeatureByID,
  useWindowResize,
} from '../../utils'

const { layerId: sourceLayer, internalSrcID } = mapConfig.mbStyleTileConfig

// Jest or whatever CANNOT find this plugin. And importing it from
// `react-map-gl` is useless as well.
if (typeof window !== undefined && typeof setRTLTextPlugin === 'function') {
  // Ensure right-to-left languages (Arabic, Hebrew) are shown correctly
  setRTLTextPlugin(
    // latest version: https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    // Yeah not today TS, thanks anyway:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    null, // supposed to be an error-handling function
    true // lazy: only load when the map first encounters Hebrew or Arabic text
  )
}

export const Map: FC<MapTypes.MapComponent> = ({
  symbLayers,
  labelLayers,
  baselayer,
  wrapClassName,
}) => {
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalContext)
  const mapRef: React.RefObject<InteractiveMap> = React.createRef()
  const { selFeatAttribs, mapLoaded, langFeatIDs } = state
  const theme = useTheme()
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  const { width, height } = useWindowResize()
  const [viewport, setViewport] = useState(mapConfig.initialMapState)
  const [mapOffset, setMapOffset] = useState<[number, number]>([0, 0])
  const [popupOpen, setPopupOpen] = useState<MapTypes.MapPopup | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState<MapTypes.MapTooltip | null>(
    null
  )
  /* eslint-disable react-hooks/exhaustive-deps */
  // ^^^^^ otherwise it wants things like mapRef and dispatch 24/7
  // Set the offset for transitions like `flyTo` and `easeTo`
  useEffect((): void => {
    const deskBreakPoint = theme.breakpoints.values.md
    const wideFella = width >= deskBreakPoint
    const offset = mapUtils.prepMapOffset(wideFella)

    setIsDesktop(wideFella)
    setMapOffset(offset)
  }, [width, height])

  // TODO: another file
  useEffect((): void => {
    if (!mapRef.current || !mapLoaded) {
      return
    }

    const map: MbMap = mapRef.current.getMap()
    const currentLayerNames = state.legendItems.map((item) => item.legendLabel)

    mapUtils.filterLayersByFeatIDs(map, currentLayerNames, langFeatIDs)
  }, [langFeatIDs])

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
      mapUtils.addLangTypeIconsToMap(map, mapConfig.langTypeIconsConfig)
    }
  }, [baselayer]) // baselayer may be irrelevant if only using Light BG

  // Do selected feature stuff on sel feat change or map load
  useEffect((): void => {
    // Map not ready
    if (!mapRef.current || !mapLoaded) {
      return
    }

    const map: MbMap = mapRef.current.getMap()

    // Deselect all features
    clearAllSelFeats(map)

    if (!selFeatAttribs) {
      return
    }

    // NOTE: won't get this far on load even if feature is selected. The timing
    // and order of the whole process prevent that. Make feature appear selected

    const { ID, Latitude: latitude, Longitude: longitude } = selFeatAttribs

    setPopupOpen(null)
    setSelFeatState(map, ID, true)

    mapUtils.flyToCoords(
      map,
      { latitude, longitude, zoom: 12 },
      mapOffset,
      selFeatAttribs
    )
  }, [selFeatAttribs, mapLoaded])
  /* eslint-enable react-hooks/exhaustive-deps */

  // TODO: animate selected feature
  function setSelFeatState(map: MbMap, id: number, selected: boolean) {
    map.setFeatureState(
      { sourceLayer, source: internalSrcID, id },
      { selected }
    )
  }

  function onHover(event: MapTypes.MapEvent) {
    mapUtils.handleHover(event, internalSrcID, setTooltipOpen)
  }

  // Runs only once and kicks off the whole thinig
  function onLoad(mapLoadEvent: MapLoadEvent) {
    const { target: map } = mapLoadEvent

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

    map.on('zoomend', function onMoveEnd(zoomEndEvent) {
      if (zoomEndEvent.selFeatAttribs && !map.isMoving()) {
        setPopupOpen({
          latitude: zoomEndEvent.selFeatAttribs.Latitude,
          longitude: zoomEndEvent.selFeatAttribs.Longitude,
          selFeatAttribs: zoomEndEvent.selFeatAttribs,
        })
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const langSrcBounds = map.getSource('languages-src').bounds
    map.fitBounds(langSrcBounds) // ensure all feats are visible

    const idFromUrl = getIDfromURLparams(window.location.search)
    const cacheOfIDs: number[] = []
    const uniqueRecords: LangRecordSchema[] = []
    const rawLangFeats = map.querySourceFeatures(internalSrcID, { sourceLayer })

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
    if (!matchingRecord) {
      const configKey = isDesktop ? 'desktop' : 'mobile'

      mapUtils.flyToCoords(
        map,
        { ...mapConfig.postLoadMapView[configKey] },
        mapOffset,
        null
      )
    }

    // TODO: set paint property
    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

    dispatch({
      type: 'INIT_LANG_LAYER_FEATURES',
      payload: uniqueRecords,
    })

    dispatch({
      type: 'SET_MAP_LOADED',
      payload: true,
    })

    map.addControl(new AttributionControl({ compact: false }), 'bottom-right')
  }

  function onNativeClick(event: MapTypes.MapEvent): void {
    // Map not ready
    if (!mapRef || !mapRef.current || !mapLoaded) {
      return
    }

    // No language features under click, clear the route. Note that this keeps
    // the `id` in the URL if there is already a selected feature, which feels a
    // little weird, but it's much better than relying on a dummy route like
    // `id=-1`. Still not the greatest so keep an eye out for a better solution.
    if (!mapUtils.areLangFeatsUnderCursor(event.features, internalSrcID)) {
      dispatch({
        type: 'SET_SEL_FEAT_ATTRIBS',
        payload: null,
      })

      // TODO: decide /how/whether to force the panel open if nothing is found
      return
    }

    setTooltipOpen(null) // super annoying if tooltip stays intact after a click
    setPopupOpen(null)

    // TODO: use `initialEntries` in <MemoryRouter> to test routing
    history.push(`/details?id=${event.features[0].properties.ID}`)
  }

  // Assumes map is ready
  function clearAllSelFeats(map: MbMap) {
    // TODO: add `selected` key?
    map.removeFeatureState({ source: internalSrcID, sourceLayer })
  }

  // TODO: into utils if it doesn't require passing 1000 args
  function onMapCtrlClick(actionID: MapTypes.MapControlAction) {
    if (!mapRef.current) {
      return
    }

    if (actionID === 'info') {
      dispatch({
        type: 'TOGGLE_OFF_CANVAS_NAV',
      })

      return
    }

    const map: MbMap = mapRef.current.getMap()

    setPopupOpen(null) // otherwise janky lag while map is moving

    if (actionID === 'home') {
      const configKey = isDesktop ? 'desktop' : 'mobile'

      mapUtils.flyToCoords(
        map,
        {
          ...mapConfig.postLoadMapView[configKey],
          disregardCurrZoom: true,
        },
        mapOffset,
        selFeatAttribs
      )

      return // assumes `in` or `out` from here down
    }

    const { zoom, latitude, longitude } = viewport

    mapUtils.flyToCoords(
      map,
      {
        latitude,
        longitude,
        zoom: actionID === 'in' ? zoom + 1 : zoom - 1,
        disregardCurrZoom: true,
      },
      [0, 0],
      selFeatAttribs
    )
  }

  return (
    <div className={wrapClassName}>
      {!mapLoaded && <LoadingBackdrop />}
      <MapGL
        // TODO: show MB attribution text (not logo) on mobile
        className="mb-language-map"
        {...viewport}
        clickRadius={4} // much comfier for small points on small screens
        ref={mapRef}
        height="100%"
        width="100%"
        attributionControl={false}
        mapOptions={{ logoPosition: 'bottom-right' }}
        mapboxApiAccessToken={mapConfig.MAPBOX_TOKEN}
        mapStyle={mapConfig.mbStyleTileConfig.customStyles.light}
        onViewportChange={setViewport}
        onClick={onNativeClick} // TODO: mv into utils
        onHover={onHover}
        onLoad={(mapLoadEvent) => {
          onLoad(mapLoadEvent)
        }}
      >
        {symbLayers && labelLayers && (
          <LangMbSrcAndLayer
            symbLayers={symbLayers}
            labelLayers={labelLayers}
            activeLangSymbGroupId={state.activeLangSymbGroupId}
            activeLangLabelId={state.activeLangLabelId}
          />
        )}
        {selFeatAttribs && popupOpen && (
          <MapPopup
            setPopupOpen={setPopupOpen}
            longitude={popupOpen.longitude}
            latitude={popupOpen.latitude}
            selFeatAttribs={selFeatAttribs}
          />
        )}
        {isDesktop && tooltipOpen && (
          <MapTooltip
            setTooltipOpen={setTooltipOpen}
            longitude={tooltipOpen.longitude}
            latitude={tooltipOpen.latitude}
            heading={tooltipOpen.heading}
            subHeading={tooltipOpen.subHeading}
          />
        )}
      </MapGL>
      <MapCtrlBtns
        mapRef={mapRef}
        mapOffset={mapOffset}
        isDesktop={isDesktop}
        onMapCtrlClick={(actionID: MapTypes.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </div>
  )
}
