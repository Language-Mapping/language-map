import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import MapGL, { InteractiveMap, MapLoadEvent } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'
import { Theme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext, LoadingBackdrop } from 'components'
import { LangMbSrcAndLayer, MapPopup, MapTooltip } from 'components/map'
import { LangRecordSchema } from '../../context/types'
import {
  MapEventType,
  LayerPropsPlusMeta,
  BaselayerType,
  MapPopupType,
  MapTooltipType,
} from './types'
import { getIDfromURLparams, findFeatureByID } from '../../utils'
import {
  prepMapOffset,
  flyToCoords,
  handleHover,
  areLangFeatsUnderCursor,
} from './utils'
import {
  mbStyleTileConfig,
  MAPBOX_TOKEN,
  initialMapState,
  postLoadMapView,
} from './config'

type MapRefType = React.RefObject<InteractiveMap>
type MapPropsType = {
  baselayer: BaselayerType
  symbLayers?: LayerPropsPlusMeta[]
  labelLayers?: LayerPropsPlusMeta[]
}
export const Map: FC<MapPropsType> = ({
  symbLayers,
  labelLayers,
  baselayer,
}) => {
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalContext)
  const mapRef: MapRefType = React.createRef()
  const { selFeatAttribs } = state
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [viewport, setViewport] = useState(initialMapState)
  const [mapOffset, setMapOffset] = useState<[number, number]>([0, 0])
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const [popupOpen, setPopupOpen] = useState<MapPopupType | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState<MapTooltipType | null>(null)

  // Set the offset for transitions like `flyTo` and `easeTo`
  useEffect((): void => {
    const offset = prepMapOffset(isDesktop)

    setMapOffset(offset)
  }, [isDesktop])

  // Do selected feature stuff on sel feat change or map load
  useEffect((): void => {
    // Map not ready
    if (!mapRef.current || !mapLoaded) {
      return
    }

    const map: mbGlFull.Map = mapRef.current.getMap()

    // Deselect all features
    clearAllSelFeats(map)

    if (!selFeatAttribs) {
      return
    }

    // NOTE: won't get this far on load even if feature is selected. The timing
    // and order of the whole process prevent that. Make feature appear selected

    setSelFeatState(map, selFeatAttribs.ID, true)

    flyToCoords(
      map,
      {
        lat: selFeatAttribs.Latitude,
        lng: selFeatAttribs.Longitude,
        zoom: 12,
      },
      mapOffset,
      selFeatAttribs
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selFeatAttribs, mapLoaded])

  function setSelFeatState(map: mbGlFull.Map, id: number, selected: boolean) {
    map.setFeatureState(
      {
        sourceLayer: mbStyleTileConfig.layerId,
        source: mbStyleTileConfig.internalSrcID,
        id,
      },
      { selected }
    )
  }

  function onHover(event: MapEventType) {
    handleHover(event, mbStyleTileConfig.internalSrcID, setTooltipOpen)
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
          ...viewport,
          zoom: map.getZoom(),
          latitude: map.getCenter().lat,
          longitude: map.getCenter().lng,
        })
      }
    })

    map.on('zoomend', function onMoveEnd(zoomEndEvent) {
      if (zoomEndEvent.selFeatAttribs) {
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
    const rawLangFeats = map.querySourceFeatures(
      mbStyleTileConfig.internalSrcID,
      {
        sourceLayer: mbStyleTileConfig.layerId,
      }
    )

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

      flyToCoords(map, { ...postLoadMapView[configKey] }, mapOffset, null)
    }

    // TODO: set paint property
    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

    dispatch({
      type: 'INIT_LANG_LAYER_FEATURES',
      payload: uniqueRecords,
    })

    setMapLoaded(true)
  }

  function onNativeClick(event: MapEventType): void {
    // Map not ready
    if (!mapRef || !mapRef.current || !mapLoaded) {
      return
    }

    // No language features under click, clear the route
    if (
      !areLangFeatsUnderCursor(event.features, mbStyleTileConfig.internalSrcID)
    ) {
      history.push(`${window.location.pathname}?id=-1`) // TODO: better solution

      return
    }

    setTooltipOpen(null) // super annoying if tooltip stays intact after a click

    // TODO: use `initialEntries` in <MemoryRouter> to test routing
    history.push(`/details?id=${event.features[0].properties.ID}`)
  }

  // Assumes map is ready
  function clearAllSelFeats(map: mbGlFull.Map) {
    map.removeFeatureState({
      source: mbStyleTileConfig.internalSrcID,
      sourceLayer: mbStyleTileConfig.layerId,
    }) // TODO: add `selected` key?
  }

  return (
    <>
      {!mapLoaded && <LoadingBackdrop />}
      <MapGL
        // TODO: show MB attribution text (not logo) on mobile
        className="mb-language-map"
        {...viewport}
        clickRadius={3} // much comfier for small points on small screens
        ref={mapRef}
        height="100%"
        width="100%"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={`mapbox://styles/mapbox/${baselayer}-v9`}
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
    </>
  )
}
