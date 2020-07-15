import React, { FC, useState, useContext, useEffect } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { MapPopup } from 'components/map'
import { MAPBOX_TOKEN } from '../../config'
import { LangRecordSchema } from '../../context/types'
import {
  InitialMapState,
  LayerWithMetadata,
  MapClickType,
  PopupType,
} from './types'
import {
  createMapLegend,
  getMbStyleDocument,
  shouldOpenPopup,
} from '../../utils'
import { langLayerConfig, langSrcConfig } from './config'

const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'
export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const { state, dispatch } = useContext(GlobalContext)
  const [viewport, setViewport] = useState({ latitude, longitude, zoom })
  const [symbLayers, setSymbLayers] = useState<LayerWithMetadata[]>([])
  const [labelLayers, setLabelLayers] = useState<LayerWithMetadata[]>([])
  const { activeLangSymbGroupId, activeLangLabelId } = state

  // TODO: mv popup stuff into reducer
  const [popupOpen, setPopupOpen] = useState<boolean>(false)
  const [popupSettings, setPopupSettings] = useState<PopupType>({
    heading: '',
    longitude: 0,
    latitude: 0,
  })

  useEffect(() => {
    const symbStyleUrl = `${MB_STYLES_API_URL}/${langLayerConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`

    getMbStyleDocument(symbStyleUrl, dispatch, setSymbLayers, setLabelLayers)
  }, [dispatch])

  useEffect(() => {
    const layersInActiveGroup = symbLayers.filter(
      (layer: LayerWithMetadata) =>
        layer.metadata['mapbox:group'] === activeLangSymbGroupId
    )

    const legend = createMapLegend(layersInActiveGroup)

    dispatch({
      type: 'SET_LANG_LAYER_LEGEND',
      payload: legend,
    })
  }, [activeLangSymbGroupId, symbLayers, dispatch])

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
      // TODO: show MB attribution text (not logo) on mobile
      className="mb-language-map"
      onClick={(event: MapClickType): void => {
        const { features, lngLat } = event

        if (!shouldOpenPopup(features, langSrcConfig.internalSrcID)) {
          return
        }

        setPopupOpen(true)
        setPopupSettings({
          heading: features[0].properties['Language Endonym'] as string,
          latitude: lngLat[1],
          longitude: lngLat[0],
        })
      }}
      onLoad={(map) => {
        const features = map.target
          .querySourceFeatures(langSrcConfig.internalSrcID, {
            sourceLayer: langSrcConfig.layerId,
          })
          .map(({ properties }) => properties)

        dispatch({
          type: 'INIT_LANG_LAYER_FEATURES',
          payload: features as LangRecordSchema[],
        })
      }}
    >
      {popupOpen && <MapPopup {...popupSettings} setPopupOpen={setPopupOpen} />}
      {/* NOTE: it did not seem to work when using two different Styles with the same dataset unless waiting until there is something to put into <Source> */}
      {symbLayers.length && labelLayers.length && (
        <Source
          type="vector"
          url={`mapbox://${langSrcConfig.tilesetId}`}
          id={langSrcConfig.internalSrcID}
        >
          {symbLayers.map((layer: LayerWithMetadata) => {
            const isInActiveGroup =
              layer.metadata['mapbox:group'] === activeLangSymbGroupId

            return (
              <Layer
                key={layer.id}
                {...layer}
                // TODO: some kind of transition/animation on switch
                layout={{
                  visibility: isInActiveGroup ? 'visible' : 'none',
                }}
              />
            )
          })}
          {labelLayers.map((layer: LayerWithMetadata) => {
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
