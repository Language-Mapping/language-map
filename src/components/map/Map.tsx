/* eslint-disable react-hooks/exhaustive-deps */
// TOO annoying. I'll take the risk, esp. since it has not seemed problematic:
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
// TODO: try to lazy load the biggest dep of all. See:
// www.debugbear.com/blog/bundle-splitting-components-with-webpack-and-react
import { Map as MbMap, AttributionControl } from 'mapbox-gl'
import MapGL, { MapLoadEvent } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext, useMapToolsState } from 'components/context'
import { usePanelState } from 'components/panels'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { Geolocation } from './Geolocation'
import { MapPopups } from './MapPopup'
import { MapCtrlBtns } from './MapCtrlBtns'
import { CensusLayer } from './CensusLayer'
import { GeocodeMarker } from './GeocodeMarker'
import { NeighborhoodsLayer } from './NeighborhoodsLayer'

import * as config from './config'
import {
  usePopupFeatDetails,
  useOffset,
  useBreakpoint,
  useZoomToLangFeatsExtent,
  usePolygonWebMerc,
} from './hooks'
// TODO: restore:
// import { getAllLangFeatIDs, isTouchEnabled } from '../../utils'
import { getAllLangFeatIDs } from '../../utils'
import { onHover } from './events'

import * as Types from './types'
import * as utils from './utils'

const { langTypeIconsConfig } = config

utils.rightToLeftSetup()

export const Map: FC<Types.MapProps> = (props) => {
  const { mapLoaded, mapRef, setMapLoaded } = props
  const loc = useLocation()

  const { autoZoomCensus, censusActiveField, showNeighbs } = useMapToolsState()
  const { panelOpen } = usePanelState()
  const { pathname } = loc
  const { selFeatAttribs } = usePopupFeatDetails()
  const { state } = useContext(GlobalContext)
  const { langFeatures, filterHasRun } = state

  const breakpoint = useBreakpoint()
  const history = useHistory()
  const map: MbMap | undefined = mapRef.current?.getMap()
  const offset = useOffset(panelOpen)
  const polygonWebMerc = usePolygonWebMerc()

  const [beforeId, setBeforeId] = useState<string>('background')
  const [isMapTilted, setIsMapTilted] = useState<boolean>(false)
  const [mapIsMoving, setMapIsMoving] = useState<boolean>(false)
  const [showPopups, setShowPopups] = useState<boolean>(true)

  const [
    geocodeMarker,
    setGeocodeMarker,
  ] = useState<Types.GeocodeMarkerProps | null>()
  const [viewport, setViewport] = useState<Types.ViewportState>(
    config.initialMapState
  )

  // TODO: use <Marker> instead of <Popup> if possible to clear text easily
  // const [tooltip, setTooltip] = useState<Types.PopupSettings | null>(null)

  // TODO: mobile:
  const shouldFlyHome = useZoomToLangFeatsExtent(isMapTilted, map)

  // TODO: rm if not needed for hover/popup stuff
  // const interactiveLayerIds = symbCache

  useEffect(() => {
    if (!map || !polygonWebMerc) return

    utils.clearSelPolyFeats(map) // TODO: remove if not needed

    const webMercViewport = utils.getPolyWebMercView(polygonWebMerc, offset)
    const { zoom, longitude, latitude } = webMercViewport

    map.flyTo(
      { essential: true, zoom, center: [longitude, latitude], offset },
      {
        forceViewportUpdate: true,
      } as Types.CustomEventData
    )
  }, [loc])

  useEffect(() => {
    if (!map) return

    if (isMapTilted) map.setPitch(80, { forceViewportUpdate: true })
    else map.setPitch(0, { forceViewportUpdate: true })

    if (breakpoint !== 'mobile' || !panelOpen) return

    // Pitch reset in 50/50 page layout on smaller screens needs extra love:
    setTimeout(() => {
      const yOffset = isMapTilted ? -0.1 : 0.1

      // TODO: smooth this out for 3D
      map.panBy([0, yOffset * offset[1]], undefined, {
        forceViewportUpdate: true,
      })
    }, 5)
  }, [isMapTilted])

  useEffect(() => {
    setShowPopups(true) // reset it on route change just in case X was clicked
    setGeocodeMarker(null) // TODO: confirm this approach. Same as current tho
  }, [pathname])

  useEffect((): void => {
    if (!map) return

    utils.flyHome(map, nuclearClear, offset)
  }, [shouldFlyHome])

  // Auto-zoom to initial extent on Census language change
  useEffect((): void => {
    // Don't zoom on clearing Census dropdown, aka no language field selected
    if (!map || !autoZoomCensus || !censusActiveField) return

    utils.flyHome(map, nuclearClear, offset)
  }, [censusActiveField])

  // Filter lang feats in map on length change or symbology change
  useEffect((): void => {
    if (!map || !mapLoaded || !filterHasRun) return

    const getLangLayersIDs = utils.getLangLayersIDs(map.getStyle().layers || [])

    utils.filterLayersByFeatIDs(
      map,
      getLangLayersIDs,
      getAllLangFeatIDs(langFeatures)
    )
  }, [langFeatures.length, beforeId, filterHasRun])

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

    const settings = utils.getFlyToPointSettings(
      selFeatAttribs,
      offset,
      isMapTilted
    )

    utils.flyToPoint(map, settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selFeatAttribs]) // LEGIT disabling of deps. Breaks otherwise.

  useEffect(() => {
    if (!map || !mapLoaded || !map.getLayer('neighborhoods-poly')) return

    const sourceID = 'neighborhoods-new'
    const sourceLayer = 'neighborhoods'

    map.removeFeatureState({
      sourceLayer,
      source: sourceID,
    })
  }, [map, mapLoaded, pathname])

  // TODO: rm or restore this whole thing or parts
  const nuclearClear = () => {
    // setShowPopups(false)
    // setGeocodeMarker(null)
    // setTooltip(null)
  }

  function onLoad(mapLoadEvent: MapLoadEvent) {
    setMapLoaded(true)

    // `mapObj` should === `map` but avoid naming conflict just in case:
    const { target: mapObj } = mapLoadEvent

    // Maintain viewport state sync if needed (e.g. after `flyTo`), otherwise
    // the map shifts back to previous position after panning or zooming.
    mapObj.on('moveend', function onMoveEnd(zoomEndEvent) {
      // setShowPopups(true)

      setMapIsMoving(false)

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
    // TODO: rm/restore commented
    mapObj.on('movestart', function onMoveStart(zoomEndEvent) {
      // setShowPopups(false)
      setMapIsMoving(true)

      // if (zoomEndEvent.forceViewportUpdate) nuclearClear()
    })

    mapObj.on('sourcedata', function onStyleData(e) {
      if (!e.isSourceLoaded) return

      const layers = e.style._layers
      const before = utils.getLangLayersIDs(layers)[0] || 'background'

      setBeforeId(before)
    })

    mapObj.on('zoomend', function onMoveEnd(customEventData) {
      const { geocodeMarker: geocodeMarkerParams } = customEventData
      // as MapTypes.CustomEventData // WHYYYY ERRORS

      setMapIsMoving(false)

      if (geocodeMarkerParams) setGeocodeMarker(geocodeMarkerParams)
    })

    mapObj.addControl(
      new AttributionControl({ compact: false }), // Give MB well-deserved cred
      'bottom-right'
    )

    if (selFeatAttribs) {
      const settings = utils.getFlyToPointSettings(
        selFeatAttribs,
        offset,
        isMapTilted
      )

      utils.flyToPoint(mapObj, settings)
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

    if (topLangFeat) {
      history.push(
        `/Explore/Language/${topLangFeat.properties?.Language}/${topLangFeat.properties?.id}`
      )

      return // prevent boundary click underneath
    }

    // TODO: restore, remove or refactor. Better to just check for what's under?
    if (!showNeighbs) {
      history.push('/Explore/Language/none')

      return
    }

    const boundariesClicked = map.queryRenderedFeatures(event.point, {
      layers: ['neighborhoods-poly'], // TODO: make it work for all
    }) as Types.BoundaryFeat[]
    // debugger
    if (!boundariesClicked.length) {
      history.push('/Explore/Language/none')

      return
    }

    history.push(
      `/Explore/Neighborhood/${boundariesClicked[0].properties?.name}`
    )
  }

  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!map || !mapLoaded) return

    if (actionID === 'home') {
      utils.flyHome(map, nuclearClear, offset)
    } else if (actionID === 'reset-pitch') {
      setIsMapTilted(!isMapTilted)
    } else if (actionID === 'in') {
      map.zoomIn({ offset }, { forceViewportUpdate: true })
    } else if (actionID === 'out') {
      map.zoomOut({ offset }, { forceViewportUpdate: true })
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
        {/* TODO: hide label on clear */}
        {geocodeMarker && !mapIsMoving && <GeocodeMarker {...geocodeMarker} />}
        {mapLoaded && <NeighborhoodsLayer map={map} />}
        <CensusLayer
          map={map}
          config={config.pumaConfig}
          beforeId={beforeId}
          sourceLayer={config.pumaLyrSrc['source-layer']}
        />
        <CensusLayer
          map={map}
          config={config.tractsConfig}
          beforeId={beforeId}
          sourceLayer={config.tractsLyrSrc['source-layer']}
        />
        <LangMbSrcAndLayer />
        {showPopups && !mapIsMoving && (
          <MapPopups setShowPopups={setShowPopups} />
        )}
        {/* Popups are annoying on mobile */}
        {/* TODO: RESTORE */}
        {/* {!isTouchEnabled() && tooltip && (
          <MapPopup {...tooltip} setVisible={() => setTooltip(null)} />
        )} */}
      </MapGL>
      <MapCtrlBtns
        isMapTilted={isMapTilted}
        onMapCtrlClick={(actionID: Types.MapControlAction) => {
          onMapCtrlClick(actionID)
        }}
      />
    </>
  )
}
