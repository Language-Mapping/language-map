import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import queryString from 'query-string'
import MapGL, { InteractiveMap } from 'react-map-gl'
import * as mbGlFull from 'mapbox-gl'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { LangMbSrcAndLayer } from 'components/map'
import { MAPBOX_TOKEN } from '../../config'
import { LangRecordSchema } from '../../context/types'
import { InitialMapState, MapEventType, LayerPropsPlusMeta } from './types'
import { prepMapPadding } from './utils'
import {
  createMapLegend,
  getMbStyleDocument,
  langFeatClicked,
} from '../../utils'
import { langLayerConfig, langSrcConfig } from './config'

type MapRefType = React.RefObject<InteractiveMap>

const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'
const symbStyleUrl = `${MB_STYLES_API_URL}/${langLayerConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const theme = useTheme()
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalContext)
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom,
  })
  const [symbLayers, setSymbLayers] = useState<LayerPropsPlusMeta[]>()
  const [labelLayers, setLabelLayers] = useState<LayerPropsPlusMeta[]>()
  const { activeLangSymbGroupId, selFeatAttrbs } = state
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const mapRef: MapRefType = React.createRef()
  const location = useLocation()
  const mapPadding = prepMapPadding(isDesktop)

  // Do selected feature stuff on location change
  useEffect((): void => {
    if (!mapRef.current || !selFeatAttrbs) {
      return
    }

    const map: mbGlFull.Map = mapRef.current.getMap()

    flyToCoords(map, {
      lat: selFeatAttrbs.Latitude,
      lng: selFeatAttrbs.Longitude,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, selFeatAttrbs])

  // Fetch MB Style doc
  useEffect(() => {
    getMbStyleDocument(
      symbStyleUrl,
      dispatch,
      setSymbLayers,
      setLabelLayers
    ).catch((errMsg) => {
      // TODO: wire up sentry
      // eslint-disable-next-line no-console
      console.error(
        `Something went wrong trying to fetch MB style JSON: ${errMsg}`
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create map legend
  useEffect(() => {
    if (!symbLayers) {
      return
    }

    const layersInActiveGroup = symbLayers.filter(
      (layer: LayerPropsPlusMeta) =>
        layer.metadata['mapbox:group'] === activeLangSymbGroupId
    )

    const legend = createMapLegend(layersInActiveGroup)

    dispatch({
      type: 'SET_LANG_LAYER_LEGEND',
      payload: legend,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbLayers])

  function handleHover(event: MapEventType) {
    const { features, target } = event

    if (!langFeatClicked(features, langSrcConfig.internalSrcID)) {
      // TODO: hide label on mouseout
      target.style.cursor = 'default'
    } else {
      // TODO: show label on hover
      target.style.cursor = 'pointer'
    }
  }

  function flyToCoords(
    target: mbGlFull.Map,
    center: { lng: number; lat: number }
  ) {
    const zoomLevel = 12

    target.flyTo(
      {
        // Animation is considered essential with respect to
        // prefers-reduced-motion
        essential: true,
        center,
        zoom: zoomLevel,
      },
      {
        openPopup: true,
        newPosition: {
          center,
          zoom: zoomLevel,
        },
      }
    )
  }

  return (
    <MapGL
      {...viewport}
      width="100%"
      ref={mapRef}
      height="100%"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
      // TODO: show MB attribution text (not logo) on mobile
      className="mb-language-map"
      onNativeClick={(event: MapEventType): void => {
        // Deselect currently selected feature if there is one
        if (mapRef.current && selFeatAttrbs) {
          mapRef.current.getMap().setFeatureState(
            {
              sourceLayer: langSrcConfig.layerId,
              source: langSrcConfig.internalSrcID,
              id: selFeatAttrbs.ID,
            },
            { selected: false }
          )
        }

        // No language features under click
        if (!langFeatClicked(event.features, langSrcConfig.internalSrcID)) {
          history.push(`${location.pathname}`)

          return
        }

        // TODO: use `initialEntries` in <MemoryRouter> to test routing
        history.push(`/details?id=${event.features[0].properties.ID}`)
      }}
      onHover={(event: MapEventType): void => {
        handleHover(event)
      }}
      onLoad={(map) => {
        const { target } = map
        const rawLangFeats = target.querySourceFeatures(
          langSrcConfig.internalSrcID,
          {
            sourceLayer: langSrcConfig.layerId,
          }
        )

        // TODO: tighten up query params via TS
        const parsed = queryString.parse(location.search)

        // TODO: rm when no longer needed
        // target.showPadding = true // quite handy
        target.setPadding(mapPadding)

        const cacheOfIDs: mbGlFull.MapboxGeoJSONFeature[] = []
        // Just the properties for table/results, etc. Don't need the JSON cruft
        const uniqueRecords = rawLangFeats.reduce(
          // TODO: come on, fix this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (all: LangRecordSchema[], thisOne: mbGlFull.MapboxGeoJSONFeature) => {
            if (!thisOne.properties) {
              return all
            }

            // Cheap way to set some things while in the middle of the loop
            if (
              parsed &&
              parsed.id &&
              parsed.id === thisOne.properties.ID.toString()
            ) {
              flyToCoords(target, {
                lat: thisOne.properties.Latitude,
                lng: thisOne.properties.Longitude,
              })
            }

            if (cacheOfIDs.indexOf(thisOne.properties.ID) === -1) {
              cacheOfIDs.push(thisOne.properties.ID)

              return [...all, thisOne.properties]
            }

            return all
          },
          []
        )

        // TODO: get full list of features without starting at low Zoom
        // target.on('sourcedata', function (e) {
        //   if (e.isSourceLoaded) {
        //     const langSrc = e.target.getSource(langSrcConfig.internalSrcID)
        //     // also some .tileJson methods or something for ^^^
        //     // Do something when the source has finished loading
        //   }
        // })

        target.on('zoomend', function handleZoomEnd(mapObj) {
          const { newPosition } = mapObj

          if (!mapObj.newPosition) {
            return
          }

          setViewport({
            zoom: newPosition.zoom,
            latitude: newPosition.center.lat,
            longitude: newPosition.center.lng,
          })
        })

        dispatch({
          type: 'INIT_LANG_LAYER_FEATURES',
          // TODO: come on, fix this
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          payload: uniqueRecords as LangRecordSchema[],
        })
      }}
    >
      {/* NOTE: it did not seem to work when using two different Styles with the same dataset unless waiting until there is something to put into <Source> */}
      {symbLayers && labelLayers && (
        <LangMbSrcAndLayer
          selFeatID={selFeatAttrbs ? selFeatAttrbs.ID : null}
          symbLayers={symbLayers}
          labelLayers={labelLayers}
        />
      )}
    </MapGL>
  )
}
