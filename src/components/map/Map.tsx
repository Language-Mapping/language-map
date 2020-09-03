import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  AttributionControl,
  Map as MbMap,
  setRTLTextPlugin,
  LngLatBounds,
  VectorSource,
  LngLatBoundsLike,
} from 'mapbox-gl'
import MapGL, { InteractiveMap, MapLoadEvent } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext, LoadingBackdrop } from 'components'
import { initLegend } from 'components/legend/utils'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { MapPopup } from './MapPopup'
import { MapTooltip } from './MapTooltip'
import { MapCtrlBtns } from './MapCtrlBtns'
import { BoundariesLayer } from './BoundariesLayer'
import * as MapTypes from './types'
import * as utils from './utils'
import * as config from './config'
import { LangRecordSchema } from '../../context/types'
import {
  getIDfromURLparams,
  findFeatureByID,
  useWindowResize,
} from '../../utils'

const { neighbConfig } = config
const neighSrcId = neighbConfig.source.id
const neighPolyID = neighbConfig.layers[0]['source-layer']
const { layerId: sourceLayer, internalSrcID } = config.mbStyleTileConfig

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
  const [viewport, setViewport] = useState(config.initialMapState)
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
    const offset = utils.prepMapOffset(wideFella)

    setIsDesktop(wideFella)
    setMapOffset(offset)
  }, [width, height])

  // TODO: another file
  useEffect((): void => {
    if (!mapRef.current || !mapLoaded) return

    const map: MbMap = mapRef.current.getMap()
    const currentLayerNames = state.legendItems.map((item) => item.legendLabel)

    utils.filterLayersByFeatIDs(map, currentLayerNames, langFeatIDs)
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

    if (!selFeatAttribs) return

    // NOTE: won't get this far on load even if feature is selected. The timing
    // and order of the whole process prevent that. Make feature appear selected

    const { ID, Latitude: latitude, Longitude: longitude } = selFeatAttribs

    setSelFeatState(map, ID, true)

    utils.flyToCoords(
      map,
      { latitude, longitude, zoom: 12 },
      mapOffset,
      selFeatAttribs
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selFeatAttribs, mapLoaded])

  // TODO: higher zIndex on selected feature
  function setSelFeatState(map: MbMap, id: number, selected: boolean) {
    map.setFeatureState(
      { sourceLayer, source: internalSrcID, id },
      { selected }
    )
  }

  function onHover(event: MapTypes.MapEvent) {
    if (!mapRef.current || !mapLoaded) return

    const { features, target } = event
    const topMostFeature = features[0]
    const featThatMatters = [internalSrcID, neighbConfig.source.id].includes(
      topMostFeature.source
    )

    // Set cursor
    if (topMostFeature && featThatMatters) {
      target.style.cursor = 'pointer'
    } else {
      target.style.cursor = 'default'
    }

    if (!topMostFeature || !featThatMatters) return

    // Language points
    if (topMostFeature.source === internalSrcID) {
      const {
        Latitude,
        Longitude,
        Endonym,
        Language,
        'Font Image Alt': altImage,
      } = features[0].properties as LangRecordSchema

      setTooltipOpen({
        latitude: Latitude,
        longitude: Longitude,
        heading: altImage ? Language : Endonym,
        subHeading: altImage || Endonym === Language ? '' : Language,
      })

      return
    }

    const map: MbMap = mapRef.current.getMap()
    const featAsNeighFeat = topMostFeature as MapTypes.NeighFeat
    const id = featAsNeighFeat.properties.ID

    // Clear neighborhoods feature state then set to `hover`
    map.removeFeatureState({ source: neighSrcId, sourceLayer: neighPolyID })
    map.setFeatureState(
      {
        sourceLayer: neighPolyID,
        source: neighSrcId,
        id,
      },
      { hover: true }
    )

    // Close tooltip since no language point under hover
    setTooltipOpen(null)
  }

  // Runs only once and kicks off the whole thinig
  function onLoad(mapLoadEvent: MapLoadEvent) {
    const { target: map } = mapLoadEvent

    const langSrc = map.getSource('languages-src') as VectorSource
    const langSrcBounds = langSrc.bounds as LngLatBoundsLike
    const idFromUrl = getIDfromURLparams(window.location.search)
    const cacheOfIDs: number[] = []
    const uniqueRecords: LangRecordSchema[] = []
    const rawLangFeats = map.querySourceFeatures(internalSrcID, { sourceLayer })

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
      if (zoomEndEvent.selFeatAttribs) setPopupOpen(null)
    })

    map.on('zoomend', function onMoveEnd(zoomEndEvent) {
      const { selFeatAttribs: attribs } = zoomEndEvent

      if (attribs && !map.isMoving()) {
        setPopupOpen({
          latitude: attribs.Latitude,
          longitude: attribs.Longitude,
          selFeatAttribs: attribs,
        })
      }
    })
  }

  // WOW: 100 lines in one function! // TODO: other file❗️
  function onNativeClick(event: MapTypes.MapEvent): void {
    if (!mapRef || !mapRef.current || !mapLoaded) return

    const { features } = event
    const sourcesToCheck = [internalSrcID, neighbConfig.source.id]

    // Nothing under the click, or nothing we care about
    if (!features.length || !sourcesToCheck.includes(features[0].source)) {
      // Clear sel feat no matter what
      dispatch({ type: 'SET_SEL_FEAT_ATTRIBS', payload: null })

      return
    }

    const topFeat = features[0]
    const isNeighborhood = topFeat.source === neighbConfig.source.id

    if (isNeighborhood) {
      const map: MbMap = mapRef.current.getMap()
      const neighFeat = topFeat as MapTypes.NeighFeat

      map.removeFeatureState({ source: neighSrcId, sourceLayer })

      map.setFeatureState(
        {
          sourceLayer: neighPolyID,
          source: neighSrcId,
          id: neighFeat.properties.ID,
        },
        { selected: true }
      )

      const { type, coordinates } = neighFeat.geometry
      let polyCoords

      if (type === 'MultiPolygon') {
        // eslint-disable-next-line prefer-destructuring
        // TODO: fix
        // polyCoords = coordinates[0][0]
        // eslint-disable-next-line no-alert
        alert('sorry, multi-polygons not ready yet!')
      } else if (type === 'Polygon') {
        // eslint-disable-next-line prefer-destructuring
        polyCoords = coordinates[0]
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const clickedFeatBounds = polyCoords.reduce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (allBounds: LngLatBounds, thisSet) => allBounds.extend(thisSet),
        new LngLatBounds()
      )

      const { latitude, longitude, zoom } = utils.getWebMercSettings(
        width,
        height,
        isDesktop,
        mapOffset,
        clickedFeatBounds.toArray(),
        /* eslint-disable operator-linebreak */
        isDesktop
          ? { top: 60, bottom: 60, right: 60, left: 60 + mapOffset[0] * 2 }
          : { top: 30, bottom: height / 2 + 30, left: 30, right: 30 }
        /* eslint-enable operator-linebreak */
      )

      map.flyTo(
        {
          // Not THAT essential if you... don't like cool things
          essential: true,
          center: { lng: longitude, lat: latitude },
          zoom,
        },
        { selFeatAttribs, forceViewportUpdate: true }
      )
    } else {
      const langFeat = topFeat as MapTypes.LangFeature

      // TODO: use `initialEntries` in <MemoryRouter> to test routing
      history.push(`/details?id=${langFeat.properties.ID}`)
    }

    // TODO: rm if not needed
    // No language features under click, clear the route. Note that this keeps
    // the `id` in the URL if there is already a selected feature, which feels a
    // little weird, but it's much better than relying on a dummy route like
    // `id=-1`. Still not the greatest so keep an eye out for a better solution.

    setTooltipOpen(null) // super annoying if tooltip stays intact after a click
    setPopupOpen(null) // closed by movestate anyway, but smoother this way
  }

  // Assumes map is ready
  function clearAllSelFeats(map: MbMap) {
    // TODO: add `selected` key?
    map.removeFeatureState({ source: internalSrcID, sourceLayer })
  }

  function flyHome() {
    if (!mapRef.current) return

    const map: MbMap = mapRef.current.getMap()
    const { latitude, longitude, zoom } = utils.getWebMercSettings(
      width,
      height,
      isDesktop,
      mapOffset,
      config.initialBounds
    )

    // Don't really need the `flyToCoords` util for this first one
    map.flyTo(
      {
        essential: true, // not THAT essential if you... don't like cool things
        zoom,
        center: { lng: longitude, lat: latitude },
      },
      { selFeatAttribs, forceViewportUpdate: true }
    )
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
      const { zoom } = viewport

      utils.flyToCoords(
        map,
        {
          ...viewport,
          zoom: actionID === 'in' ? zoom + 1 : zoom - 1,
          disregardCurrZoom: true,
        },
        [0, 0],
        selFeatAttribs
      )
    }
  }

  return (
    <div className={wrapClassName}>
      {!mapLoaded && <LoadingBackdrop />}
      <MapGL
        {...viewport}
        className="mb-language-map"
        clickRadius={4} // much comfier for small points on small screens
        ref={mapRef}
        height="100%"
        width="100%"
        attributionControl={false}
        mapOptions={{ logoPosition: 'bottom-right' }}
        mapboxApiAccessToken={config.MAPBOX_TOKEN}
        mapStyle={config.mbStyleTileConfig.customStyles.light}
        onViewportChange={setViewport}
        onClick={(event: MapTypes.MapEvent) => onNativeClick(event)}
        onHover={onHover}
        onLoad={(mapLoadEvent) => {
          onLoad(mapLoadEvent)
        }}
      >
        {symbLayers && labelLayers && (
          <>
            {symbLayers && state.neighbLayerVisible && (
              <BoundariesLayer
                beforeId={
                  /* eslint-disable operator-linebreak */
                  state.legendItems.length
                    ? state.legendItems[0].legendLabel
                    : ''
                  /* eslint-enable operator-linebreak */
                }
              />
            )}
            <LangMbSrcAndLayer
              {...{ symbLayers, labelLayers }}
              activeLangSymbGroupId={state.activeLangSymbGroupId}
              activeLangLabelId={state.activeLangLabelId}
            />
          </>
        )}
        {selFeatAttribs && popupOpen && (
          <MapPopup {...popupOpen} {...{ setPopupOpen, selFeatAttribs }} />
        )}
        {isDesktop && tooltipOpen && (
          <MapTooltip setTooltipOpen={setTooltipOpen} {...tooltipOpen} />
        )}
      </MapGL>
      <MapCtrlBtns
        {...{ mapRef, mapOffset, isDesktop }}
        onMapCtrlClick={(actionID: MapTypes.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </div>
  )
}
