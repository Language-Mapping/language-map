import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import MapGL, { InteractiveMap, MapLoadEvent } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext, LoadingBackdrop } from 'components'
import { LangMbSrcAndLayer } from 'components/map'
import { LangRecordSchema } from '../../context/types'
import { MapEventType, LayerPropsPlusMeta, BaselayerType } from './types'
import { getIDfromURLparams, findFeatureByID } from '../../utils'
import {
  prepMapPadding,
  flyToCoords,
  handleHover,
  areLangFeatsUnderCursor,
} from './utils'
import {
  mbStyleTileConfig,
  MAPBOX_TOKEN,
  initialMapState,
  postLoadInitMapStates,
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
  const theme = useTheme()
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalContext)
  const mapRef: MapRefType = React.createRef()
  const { selFeatAttrbs } = state
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  const [viewport, setViewport] = useState(initialMapState)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)

  // Do selected feature stuff on sel feat change
  useEffect((): void => {
    // Map not ready
    if (!mapRef.current || !mapLoaded) {
      return
    }

    const map: mbGlFull.Map = mapRef.current.getMap()

    // Deselect all features
    clearAllSelFeats(map)

    if (!selFeatAttrbs) {
      return
    }

    // Make feature appear selected
    setSelFeatState(map, selFeatAttrbs.ID, true)

    flyToCoords(map, {
      lat: selFeatAttrbs.Latitude,
      lng: selFeatAttrbs.Longitude,
      zoom: 12,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selFeatAttrbs])

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
    handleHover(event, mbStyleTileConfig.internalSrcID)
  }

  // Update viewport state after things like `flyTo`, otherwise the map shifts
  // back to previous position after panning or zooming.
  function forceViewportUpdate(newPosition?: {
    zoom: number
    center: {
      lat: number
      lng: number
    }
  }) {
    // Custom object via `EventData` (e.g. after `flyTo`)
    if (!newPosition) {
      return
    }

    setViewport({
      zoom: newPosition.zoom,
      latitude: newPosition.center.lat,
      longitude: newPosition.center.lng,
    })
  }

  // Runs only once and kicks off the whole thinig
  function onLoad(mapLoadEvent: MapLoadEvent) {
    const { target: map } = mapLoadEvent

    map.on('zoomend', function handleZoomEnd(mapObj) {
      forceViewportUpdate(mapObj.newPosition)
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const langSrcBounds = map.getSource('languages-src').bounds
    map.fitBounds(langSrcBounds) // ensure all feats are visible

    const cacheOfIDs: number[] = []
    const uniqueRecords: LangRecordSchema[] = []
    const idFromUrl = getIDfromURLparams(window.location.search)
    const rawLangFeats = map.querySourceFeatures(
      mbStyleTileConfig.internalSrcID,
      {
        sourceLayer: mbStyleTileConfig.layerId,
      }
    )

    // TODO: rm when no longer needed
    // map.showPadding = true // quite handy
    map.setPadding(prepMapPadding(isDesktop))
    // TODO: ^^^^ make pinch and scroll wheel work as expected ^^^^

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

    if (!matchingRecord) {
      const configKey = isDesktop ? 'desktop' : 'mobile'

      flyToCoords(map, {
        ...postLoadInitMapStates[configKey],
      })
    } else {
      setSelFeatState(map, matchingRecord.ID, true)

      setViewport({
        latitude: matchingRecord.Latitude,
        longitude: matchingRecord.Longitude,
        zoom: 12,
      })

      // This stopped working after a billion changes...
      // flyToCoords(map, {
      //   lat: matchingRecord.Latitude,
      //   lng: matchingRecord.Longitude,
      // })
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

    // TODO: use `initialEntries` in <MemoryRouter> to test routing
    history.push(`/details?id=${event.features[0].properties.ID}`)
  }

  // Assumes map is ready
  function clearAllSelFeats(map: mbGlFull.Map) {
    map.removeFeatureState({
      source: mbStyleTileConfig.internalSrcID,
      sourceLayer: mbStyleTileConfig.layerId,
    }) // TODO: add `selected` key
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
        {/* NOTE: it did not seem to work when using two different Styles with the same dataset unless waiting until there is something to put into <Source> */}
        {symbLayers && labelLayers && (
          <LangMbSrcAndLayer
            symbLayers={symbLayers}
            labelLayers={labelLayers}
          />
        )}
      </MapGL>
    </>
  )
}
