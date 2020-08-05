// TODO: deal with this nightmare
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import queryString from 'query-string'
import MapGL from 'react-map-gl'
import MbGLfull from 'mapbox-gl'
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
  shouldOpenPopup,
} from '../../utils'
import { langLayerConfig, langSrcConfig } from './config'

type MapRefType = React.RefObject<mapboxgl.Map>

const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const theme = useTheme()
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalContext)
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom,
  })
  const [symbLayers, setSymbLayers] = useState<LayerPropsPlusMeta[]>([])
  // TODO: set the full feature attribs in glboal state (rather than just ID)
  const [selFeatID, setSelFeatID] = useState<null | number>(null)
  const [labelLayers, setLabelLayers] = useState<LayerPropsPlusMeta[]>([])
  const { activeLangSymbGroupId } = state
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const mapRef: MapRefType = React.createRef()
  const location = useLocation()

  // Do selected feature stuff on location change
  useEffect((): void => {
    if (!mapRef.current || !state.langFeaturesCached.length) {
      return
    }

    const map: MbGLfull.Map = mapRef.current.getMap()
    const parsed = queryString.parse(location.search)

    if (!parsed || !parsed.id) {
      return
    }

    // TODO: handle scenario where feature exists in cached but not filtered
    // const matchedFeat = state.langFeaturesCached.find(
    //       //   (feat) => parsed.id === feat.ID.toString()
    // )

    const rawLangFeats = map.querySourceFeatures(langSrcConfig.internalSrcID, {
      sourceLayer: langSrcConfig.layerId,
    })

    const matchingRecord = rawLangFeats.find(
      (geojsonFeat) => geojsonFeat.id.toString() === parsed.id
    )

    if (!matchingRecord) {
      return
    }

    setSelFeatID(matchingRecord.id)
    flyToCoords(map, matchingRecord)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // Fetch MB Style doc
  useEffect(() => {
    const symbStyleUrl = `${MB_STYLES_API_URL}/${langLayerConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`

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
    const layersInActiveGroup = symbLayers.filter(
      (layer: LayerPropsPlusMeta) =>
        layer.metadata['mapbox:group'] === activeLangSymbGroupId
    )

    const legend = createMapLegend(layersInActiveGroup)

    dispatch({
      type: 'SET_LANG_LAYER_LEGEND',
      payload: legend,
    })
  }, [activeLangSymbGroupId, symbLayers, dispatch])

  function handleHover(event: MapEventType) {
    const { features, target } = event

    if (!shouldOpenPopup(features, langSrcConfig.internalSrcID)) {
      // TODO: hide label on mouseout
      target.style.cursor = 'default'
    } else {
      // TODO: show label on hover
      target.style.cursor = 'pointer'
    }
  }

  function flyToCoords(target, matchingRecord) {
    const coords = matchingRecord.geometry.coordinates
    const newZoom = 14

    target.flyTo(
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // padding, // NOTE: this is evidently TS'ed incorrectly
        // Animation is considered essential with respect to
        // prefers-reduced-motion
        essential: true,
        center: [coords[0], coords[1]],
        zoom: newZoom,
      },
      {
        openPopup: true,
        updateViewportState: true,
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
        // Not ready
        if (!mapRef.current) {
          return
        }

        // Deselect currently selected feature if there is one
        if (selFeatID) {
          mapRef.current.getMap().setFeatureState(
            {
              sourceLayer: langSrcConfig.layerId,
              source: langSrcConfig.internalSrcID,
              id: selFeatID,
            },
            { selected: false }
          )
        }

        // Not ready due to no features under click or
        if (!shouldOpenPopup(event.features, langSrcConfig.internalSrcID)) {
          // TODO: use current route sans search, don't switch to details
          history.push(`/details`)

          return
        }

        const topFeature = event.features[0]
        const selFeatAttrbs = topFeature.properties

        // TODO: use `initialEntries` in <MemoryRouter> to test routing
        history.push(`/details?id=${selFeatAttrbs.ID}`)
        setSelFeatID(selFeatAttrbs.ID) // TODO: global state w/all attribs
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
        const parsed = window ? queryString.parse(window.location.search) : ''
        target.setPadding(prepMapPadding(isDesktop))

        // TODO: get full list of features without starting at low Zoom
        // target.on('sourcedata', function (e) {
        //   if (e.isSourceLoaded) {
        //     const langSrc = e.target.getSource(langSrcConfig.internalSrcID)
        //     // also some .tileJson methods or something for ^^^
        //     // Do something when the source has finished loading
        //   }
        // })
        target.on('zoomend', (mapObj) => {
          const { updateViewportState } = mapObj

          if (!updateViewportState) {
            return null
          }

          setViewport({
            zoom: target.getZoom(),
            latitude: target.getCenter().lat,
            longitude: target.getCenter().lng,
          })

          return null
        })

        // TODO: tighten up query params via TS
        // TODO: make it all reusable, including `flyTo`, for route changes
        if (parsed && parsed.id) {
          const matchingRecord = rawLangFeats.find((feature) => {
            const featAttribs = feature.properties as LangRecordSchema

            return featAttribs.ID.toString() === parsed.id
          })

          if (matchingRecord) {
            flyToCoords(target, matchingRecord)
          }
        }

        // Just the properties for table/results, etc. Don't need the cruft from
        // geojson.
        // TODO: could `matchingRecord` be found within the `.map` here to reduce looping/iteration of `.find`?
        const featsWithAttribsOnly = rawLangFeats.map(
          ({ properties }) => properties
        )

        dispatch({
          type: 'INIT_LANG_LAYER_FEATURES',
          payload: featsWithAttribsOnly as LangRecordSchema[],
        })
      }}
    >
      {/* NOTE: it did not seem to work when using two different Styles with the same dataset unless waiting until there is something to put into <Source> */}
      {symbLayers.length && labelLayers.length && (
        <LangMbSrcAndLayer
          selFeatID={selFeatID}
          symbLayers={symbLayers}
          labelLayers={labelLayers}
        />
      )}
    </MapGL>
  )
}
