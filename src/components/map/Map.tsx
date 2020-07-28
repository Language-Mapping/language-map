// TODO: deal with this nightmare
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import queryString from 'query-string'
import MapGL, { Source, Layer } from 'react-map-gl'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
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

const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const theme = useTheme()
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalContext)
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom,
    pitch: 0,
    bearing: 0,
  })
  const [symbLayers, setSymbLayers] = useState<LayerPropsPlusMeta[]>([])
  const [selFeatID, setSelFeatID] = useState<null | number>(null)
  const [labelLayers, setLabelLayers] = useState<LayerPropsPlusMeta[]>([])
  const { activeLangSymbGroupId, activeLangLabelId } = state
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

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
  }, [dispatch])

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

  const mapRef = React.createRef()

  return (
    <MapGL
      {...viewport}
      width="100%"
      // @ts-ignore
      ref={mapRef}
      height="100%"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
      // TODO: show MB attribution text (not logo) on mobile
      className="mb-language-map"
      onNativeClick={(event: MapEventType): void => {
        const { features } = event

        // Not ready
        if (!mapRef.current) {
          return
        }

        const topFeature = features[0]

        // Clickout deselects
        if (selFeatID) {
          // @ts-ignore
          mapRef.current.getMap().setFeatureState(
            {
              // @ts-ignore
              sourceLayer: langSrcConfig.layerId,
              source: langSrcConfig.internalSrcID,
              id: selFeatID,
            },
            { selected: false }
          )
        }

        // Not ready
        if (!shouldOpenPopup(features, langSrcConfig.internalSrcID)) {
          return
        }

        const selFeatAttrbs = topFeature.properties

        // @ts-ignore
        mapRef.current.getMap().setFeatureState(
          {
            // @ts-ignore
            sourceLayer: topFeature.layer['source-layer'],
            id: selFeatAttrbs.ID,
            source: topFeature.layer.source,
          },
          { selected: true }
        )

        history.push(`/details?id=${selFeatAttrbs.ID}`)
        setSelFeatID(selFeatAttrbs.ID)
      }}
      onHover={(event: MapEventType): void => {
        const { features, target } = event

        if (!shouldOpenPopup(features, langSrcConfig.internalSrcID)) {
          target.style.cursor = 'default'
        } else {
          target.style.cursor = 'pointer'
        }
      }}
      onLoad={(map) => {
        const { target } = map
        const rawLangFeats = target.querySourceFeatures(
          langSrcConfig.internalSrcID,
          {
            sourceLayer: langSrcConfig.layerId,
          }
        )
        // TODO: use `initialEntries` in <MemoryRouter> to test routing
        const parsed = window ? queryString.parse(window.location.search) : ''

        target.on('zoomend', (mapObj) => {
          const { updateViewportState } = mapObj

          if (!updateViewportState) {
            return null
          }

          setViewport({
            zoom: target.getZoom(),
            pitch: target.getPitch(),
            bearing: target.getBearing(),
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

            return featAttribs.ID === parseInt(parsed.id, 10)
          })

          if (matchingRecord) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const asGeoJSON = matchingRecord.toJSON()
            const coords = asGeoJSON.geometry.coordinates
            const newZoom = 14
            const padding = prepMapPadding(isDesktop)

            target.flyTo(
              {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                padding, // NOTE: this is evidently TS'ed incorrectly
                center: [coords[0], coords[1]],
                zoom: newZoom,
                // Animation is considered essential with respect to
                // prefers-reduced-motion
                essential: true,
              },
              {
                openPopup: true,
                updateViewportState: true,
                featureProps: asGeoJSON.properties,
              }
            )
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
        <Source
          type="vector"
          url={`mapbox://${langSrcConfig.tilesetId}`}
          // @ts-ignore
          promoteId="ID"
          id={langSrcConfig.internalSrcID}
        >
          {symbLayers.map((layer: LayerPropsPlusMeta) => {
            const isInActiveGroup =
              layer.metadata['mapbox:group'] === activeLangSymbGroupId
            const paint = {
              ...layer.paint,
              'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                25,
                5,
              ],
            }

            return (
              <Layer
                key={layer.id}
                {...layer}
                // TODO: some kind of transition/animation on switch
                layout={{
                  visibility: isInActiveGroup ? 'visible' : 'none',
                }}
                // @ts-ignore
                paint={paint}
              />
            )
          })}
          {labelLayers.map((layer: LayerPropsPlusMeta) => {
            const isActiveLabel = layer.id === activeLangLabelId

            // TODO: some kind of transition/animation on switch
            const layout = {
              ...layer.layout,
              visibility: isActiveLabel ? 'visible' : 'none',
            }

            return (
              <Layer
                key={layer.id}
                id={layer.id}
                type={layer.type}
                source={layer.source}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                source-layer={layer['source-layer']}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                paint={layer.paint}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                layout={layout}
              />
            )
          })}
        </Source>
      )}
    </MapGL>
  )
}
