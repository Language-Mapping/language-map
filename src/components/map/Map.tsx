// TOO annoying. I'll take the risk, esp. since it has not seemed problematic:
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useContext, useEffect, useCallback } from 'react'
import { isMobile } from 'react-device-detect'
import { useHistory, useLocation } from 'react-router-dom'
import { Map as MbMap, AttributionControl } from 'mapbox-gl'
import MapGL, { MapLoadEvent } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import {
  GlobalContext,
  useMapToolsState,
  useMapToolsDispatch,
} from 'components/context'
import { useBreakpoint } from 'components/generic'
import { onHover } from './events'
import { LangMbSrcAndLayer } from './LangMbSrcAndLayer'
import { Geolocation } from './Geolocation'
import { MapPopup, MapPopups } from './MapPopup'
import { MapCtrlBtns } from './MapCtrlBtns'
import { CensusLayer } from './CensusLayer'
import { GeocodeMarker } from './GeocodeMarker'
import { PolygonLayer } from './NeighborhoodsLayer'
import { getAllLangFeatIDs } from '../../utils'
import { useZoomToLangFeatsExtent } from './hooks'

import * as Types from './types'
import * as utils from './utils'
import * as config from './config'

const { mbStyleTileConfig, langTypeIconsConfig, initialMapState } = config

utils.rightToLeftSetup()

export const Map: FC<Types.MapProps> = (props) => {
  const { children, mapLoaded, mapRef, setMapLoaded } = props
  const history = useHistory()
  const loc = useLocation()
  const { pathname } = loc

  const { autoZoomCensus, censusActiveField, baseLayer } = useMapToolsState()
  const { geocodeMarkerText } = useMapToolsState()
  const { state } = useContext(GlobalContext)
  const { langFeatures, filterHasRun } = state
  const mapToolsDispatch = useMapToolsDispatch()
  const breakpoint = useBreakpoint()

  const map: MbMap | undefined = mapRef.current?.getMap()

  const [beforeId, setBeforeId] = useState<string>('background')
  const [tooltip, setTooltip] = useState<Types.Tooltip | null>(null)
  const [isMapTilted, setIsMapTilted] = useState<boolean>(false)
  const [mapIsMoving, setMapIsMoving] = useState<boolean>(true)
  const [showPopups, setShowPopups] = useState<boolean>(true)
  const [viewport, setViewport] = useState<Types.ViewportState>(initialMapState)
  const [mapStyle, setMapStyle] = useState(mbStyleTileConfig.customStyles.light)
  const shouldFlyHome = useZoomToLangFeatsExtent(isMapTilted, map) // TODO: mob
  const handlePopupClose = useCallback(() => setShowPopups(false), [])
  const handleGeocodeClose = useCallback(
    () => mapToolsDispatch({ type: 'SET_GEOCODE_LABEL', payload: null }),
    []
  )

  useEffect(() => {
    if (!map) return

    if (isMapTilted) map.setPitch(80, { forceViewportUpdate: true })
    else map.setPitch(0, { forceViewportUpdate: true })
  }, [isMapTilted])

  // Reset popup visibility and clear geocode marker
  useEffect(() => {
    setShowPopups(true) // reset it on route change just in case X was clicked
  }, [pathname])

  useEffect(() => {
    if (map) utils.flyHome(map, breakpoint)
  }, [shouldFlyHome])

  // Load symbol icons on load. Must be done on load and whenever `baselayer` is
  // changed, but this is handled nicely thanks to MB's `styleimagemissing`.
  useEffect(() => {
    if (map) utils.addLangTypeIconsToMap(map, langTypeIconsConfig)
  }, [map, mapLoaded])

  // Set baselayer
  useEffect(() => {
    if (map) setMapStyle(mbStyleTileConfig.customStyles[baseLayer])
  }, [baseLayer])

  // Auto-zoom to initial extent on Census language change
  useEffect(() => {
    // Don't zoom on clearing Census dropdown, aka no language field selected
    if (map && autoZoomCensus && censusActiveField)
      utils.flyHome(map, breakpoint)
  }, [censusActiveField])

  // Filter lang feats in map on length change or symbology change
  useEffect(() => {
    if (!map || !mapLoaded || !filterHasRun) return

    const getLangLayersIDs = utils.getLangLayersIDs(map.getStyle().layers || [])

    utils.filterLayersByFeatIDs(
      map,
      getLangLayersIDs,
      getAllLangFeatIDs(langFeatures)
    )
  }, [langFeatures.length, beforeId, filterHasRun])

  function onLoad(mapLoadEvent: MapLoadEvent) {
    setMapLoaded(true)

    // `mapObj` should === `map` but avoid naming conflict just in case:
    const { target: mapObj } = mapLoadEvent

    // Maintain viewport state sync if needed (e.g. after `flyTo`), otherwise
    // the map shifts back to previous position after panning or zooming.
    mapObj.on('moveend', function onMoveEnd(zoomEndEvent) {
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

    mapObj.on('movestart', function onMoveStart(zoomEndEvent) {
      setMapIsMoving(true) // closes popup on the start of moving so no jank
    })

    // Very noisy console otherwise, on every basemap/style change.
    mapObj.on('styleimagemissing', function onStyleImageMissing() {
      utils.addLangTypeIconsToMap(mapObj, langTypeIconsConfig)
    })

    mapObj.on('sourcedata', function onStyleData(e) {
      if (!e.isSourceLoaded) return

      const layers = e.style._layers
      const before = utils.getLangLayersIDs(layers)[0] || 'background'

      setBeforeId(before)
    })

    mapObj.on('zoomend', function onMoveEnd(zoomEndEvent) {
      setMapIsMoving(false)
    })

    // Prevent Census symbology from going all black on baselayer change
    mapObj.on('styledataloading', function onMoveEnd(zoomEndEvent) {
      setMapLoaded(false)
    })

    // Prevent Census symbology from going all black on baselayer change
    mapObj.on('styledata', function onMoveEnd(zoomEndEvent) {
      if (mapObj.areTilesLoaded()) setMapLoaded(true)
    })

    mapObj.addControl(
      new AttributionControl({ compact: false }), // give MB well-deserved cred
      'bottom-right'
    )
  }

  function onClick(event: Types.MapEvent): void {
    if (!map || !mapLoaded) return

    // Clear geocode marker and tooltip
    mapToolsDispatch({ type: 'SET_GEOCODE_LABEL', payload: null })
    setTooltip(null)

    // CRED: https://stackoverflow.com/a/42984268/1048518
    const topLangFeat = utils.queryRenderedPoints(
      event.point,
      map,
      utils.getLangLayersIDs(map.getStyle().layers || [])
    )[0]

    if (topLangFeat) {
      history.push(
        `/Explore/Language/${topLangFeat.properties?.Language}/${topLangFeat.properties?.id}`
      )

      return // no need to check for anything else
    }

    const clickedPolygons = map.queryRenderedFeatures(event.point, {
      // TODO: de-fragilize the world
      layers: [
        'neighborhoods-poly',
        'counties-poly',
        'tract-poly',
        'puma-poly',
      ],
    }) as Types.BoundaryFeat[]

    let targetRoute = ''

    // TODO: tighten up routes w/TS, and move most of this function into utils
    if (clickedPolygons.length) {
      const topPoly = clickedPolygons[0]
      const { properties, source } = topPoly
      const uniqueID = properties.name || properties.GEOID

      if (source === 'neighborhoods') {
        targetRoute = `/Explore/Neighborhood/${uniqueID}`
      } else if (source === 'counties') {
        targetRoute = `/Explore/County/${uniqueID}`
      } else if (censusActiveField) {
        const { id, scope } = censusActiveField
        targetRoute = `/Census/${scope}/${id}/${uniqueID}`
      }

      history.push(targetRoute)

      return
    }

    history.push(targetRoute || '/Explore/Language/none') // no feat. selected
  }

  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!map || !mapLoaded) return

    if (actionID === 'home') {
      utils.flyHome(map, breakpoint)
    } else if (actionID === 'reset-pitch') {
      setIsMapTilted(!isMapTilted)
    } else if (actionID === 'in') {
      map.zoomIn(undefined, { forceViewportUpdate: true })
    } else if (actionID === 'out') {
      map.zoomOut(undefined, { forceViewportUpdate: true })
    }
  }

  return (
    <>
      <div className="map-container">
        {children}
        <MapGL
          {...viewport}
          {...config.mapProps}
          mapStyle={mapStyle}
          ref={mapRef}
          onViewportChange={setViewport}
          onClick={(event: Types.MapEvent) => onClick(event)}
          onHover={(event: Types.MapEvent) => {
            if (isMobile) return

            onHover(event, setTooltip, map)
          }}
          onLoad={(mapLoadEvent) => onLoad(mapLoadEvent)}
        >
          <Geolocation
            onViewportChange={(mapViewport: Types.ViewportState) => {
              // CRED:
              // github.com/visgl/react-map-gl/issues/887#issuecomment-531580394
              setViewport({ ...mapViewport, zoom: config.POINT_ZOOM_LEVEL })
            }}
          />
          {geocodeMarkerText && !mapIsMoving && (
            <MapPopup
              heading={geocodeMarkerText.text}
              latitude={geocodeMarkerText.latitude}
              longitude={geocodeMarkerText.longitude}
              handleClose={handleGeocodeClose}
            />
          )}
          <PolygonLayer
            {...{ map, mapLoaded, beforeId }}
            configKey="counties"
          />
          <PolygonLayer
            {...{ map, mapLoaded, beforeId }}
            configKey="neighborhoods"
          />
          <CensusLayer {...{ map, mapLoaded, beforeId }} configKey="puma" />
          <CensusLayer {...{ map, mapLoaded, beforeId }} configKey="tract" />
          <LangMbSrcAndLayer
            map={map}
            mapLoaded={mapLoaded}
            isMapTilted={isMapTilted}
          />
          {mapLoaded && showPopups && !mapIsMoving && (
            <MapPopups handleClose={handlePopupClose} />
          )}
          {/* Popups are annoying on mobile */}
          {!isMobile && tooltip && !mapIsMoving && (
            <GeocodeMarker {...tooltip} subtle />
          )}
        </MapGL>
        <MapCtrlBtns
          isMapTilted={isMapTilted}
          onMapCtrlClick={(actionID: Types.MapControlAction) => {
            onMapCtrlClick(actionID)
          }}
        />
      </div>
    </>
  )
}
