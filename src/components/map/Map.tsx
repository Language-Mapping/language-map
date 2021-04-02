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
import { PolygonLayer } from './NeighborhoodsLayer'

import * as config from './config'
import {
  useSelLangPointCoords,
  useOffset,
  useZoomToLangFeatsExtent,
  useBreakpoint,
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

  const { autoZoomCensus, censusActiveField } = useMapToolsState()
  const { pathname } = loc
  const selLangPointCoords = useSelLangPointCoords()
  const { state } = useContext(GlobalContext)
  const { langFeatures, filterHasRun } = state

  const history = useHistory()
  const map: MbMap | undefined = mapRef.current?.getMap()
  const offset = useOffset()
  const breakpoint = useBreakpoint()
  const { panelOpen } = usePanelState()

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

  // TODO: mobile:
  const shouldFlyHome = useZoomToLangFeatsExtent(isMapTilted, map)

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

  // Reset popup visibility and clear geocode marker
  useEffect(() => {
    setShowPopups(true) // reset it on route change just in case X was clicked
    setGeocodeMarker(null) // TODO: confirm this approach. Same as current tho
  }, [pathname])

  useEffect(() => {
    if (!map) return

    utils.flyHome(map, offset)
  }, [shouldFlyHome])

  // Auto-zoom to initial extent on Census language change
  useEffect(() => {
    // Don't zoom on clearing Census dropdown, aka no language field selected
    if (!map || !autoZoomCensus || !censusActiveField) return

    utils.flyHome(map, offset)
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

  // (Re)load symbol icons. Must be done on load and whenever `baselayer` is
  // changed, otherwise the images no longer exist.
  useEffect(() => {
    if (!mapRef.current) return

    utils.addLangTypeIconsToMap(mapRef.current.getMap(), langTypeIconsConfig)
  }, []) // add `baselayer` as dep if using more than just light BG
  /* eslint-enable react-hooks/exhaustive-deps */

  // Do selected feature stuff on sel feat change or map load
  useEffect(() => {
    if (
      !map ||
      !mapLoaded ||
      selLangPointCoords.lat === null ||
      selLangPointCoords.lon === null
    )
      return

    const settings = utils.getFlyToPointSettings(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { ...selLangPointCoords },
      offset,
      isMapTilted
    )

    utils.flyToPoint(map, settings)
    // LEGIT disabling of deps. Breaks otherwise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selLangPointCoords.lat, selLangPointCoords.lon])

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

    mapObj.on('sourcedata', function onStyleData(e) {
      if (!e.isSourceLoaded) return

      const layers = e.style._layers
      const before = utils.getLangLayersIDs(layers)[0] || 'background'

      setBeforeId(before)
    })

    mapObj.on('zoomend', function onMoveEnd(customEventData) {
      const { geocodeMarker: geocodeMarkerParams } = customEventData

      setMapIsMoving(false)

      if (geocodeMarkerParams) setGeocodeMarker(geocodeMarkerParams)
    })

    mapObj.addControl(
      new AttributionControl({ compact: false }), // Give MB well-deserved cred
      'bottom-right'
    )

    if (selLangPointCoords.lat !== null && selLangPointCoords.lon !== null) {
      const settings = utils.getFlyToPointSettings(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        selLangPointCoords,
        offset,
        isMapTilted
      )

      utils.flyToPoint(mapObj, settings)
    } else {
      utils.flyHome(mapObj, offset)
    }
  }

  function onClick(event: Types.MapEvent): void {
    if (!map || !mapLoaded) return

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

    history.push(targetRoute || '/Explore/Language/none') // "No community selected"
  }

  function onMapCtrlClick(actionID: Types.MapControlAction) {
    if (!map || !mapLoaded) return

    if (actionID === 'home') {
      utils.flyHome(map, offset)
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
        <PolygonLayer
          map={map}
          beforeId={beforeId}
          mapLoaded={mapLoaded}
          configKey="neighborhoods"
        />
        <PolygonLayer
          map={map}
          beforeId={beforeId}
          mapLoaded={mapLoaded}
          configKey="counties"
        />
        <CensusLayer
          map={map}
          config={config.pumaConfig}
          beforeId={beforeId}
          sourceLayer={config.pumaLyrSrc['source-layer']}
        />
        <CensusLayer
          map={map}
          config={config.tractConfig}
          beforeId={beforeId}
          sourceLayer={config.tractLyrSrc['source-layer']}
        />
        <LangMbSrcAndLayer />
        {mapLoaded && showPopups && !mapIsMoving && (
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
