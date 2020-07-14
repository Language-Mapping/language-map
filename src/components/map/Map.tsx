import React, { FC, useState, useContext, useEffect } from 'react'
import MapGL, { Source, Layer } from 'react-map-gl'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { MAPBOX_TOKEN } from '../../config'
import { InitialMapState, LayerWithMetadata, MbResponseType } from './types'
import { createMapLegend } from '../../utils'
import { langLayerConfig, langLabelsConfig, langSrcConfig } from './config'

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const [viewport, setViewport] = useState({ latitude, longitude, zoom })
  const { state, dispatch } = useContext(GlobalContext)
  const { activeLangSymbGroupId } = state
  const [symbLayers, setSymbLayers] = useState<LayerWithMetadata[]>([])
  const symbStyleUrl = `https://api.mapbox.com/styles/v1/${langLayerConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`
  const labelsStyleUrl = `https://api.mapbox.com/styles/v1/${langLabelsConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`

  useEffect(() => {
    // TODO: react-query or, at a minimum, get this into utils and maybe run it
    // higher up the tree instead.
    async function getMbStyleDocument() {
      const response = await fetch(symbStyleUrl)
      const {
        metadata,
        layers: allLayers,
      }: MbResponseType = await response.json()
      // TODO: instead of grabbing the first one, get the first one who has a
      // child layer that is VISIBLE. Alternatively could use the `collapsed`
      // property but that seems unintuitive.
      const firstGroupId = Object.keys(metadata['mapbox:groups'])[0]

      // Populate dropdown
      dispatch({
        type: 'INIT_LANG_LAYER_SYMB_OPTIONS',
        payload: metadata['mapbox:groups'],
      })

      // Set group ID of initial active MB Styles group
      dispatch({
        type: 'SET_LANG_LAYER_SYMBOLOGY',
        payload: firstGroupId,
      })
      const notTheBgLayerOrLabels = allLayers.filter(
        (layer: LayerWithMetadata) =>
          layer.metadata && layer.type !== 'background'
      )
      // debugger

      setSymbLayers(notTheBgLayerOrLabels)
    }

    getMbStyleDocument()
  }, [symbStyleUrl, dispatch])

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

  const { activeLangLabelId } = state
  const [labelLayers, setLabelLayers] = useState<LayerWithMetadata[]>([])

  useEffect(() => {
    // TODO: react-query or, at a minimum, get this into utils and maybe run it
    // higher up the tree instead.
    async function getMbStyleDocument() {
      const response = await fetch(labelsStyleUrl)
      const { layers: allLayers }: MbResponseType = await response.json()

      const notTheBgLayer = allLayers.filter(
        (layer: LayerWithMetadata) => layer.type !== 'background'
      )
      const labels = notTheBgLayer.map((layer) => layer.id)

      // Populate dropdown
      dispatch({
        type: 'INIT_LANG_LAYER_LABEL_OPTIONS',
        payload: labels,
      })

      // TODO: instead of grabbing the first one, get the first VISIBLE layer.
      dispatch({ type: 'SET_LANG_LAYER_LABELS', payload: labels[0] })
      setLabelLayers(notTheBgLayer)
    }

    getMbStyleDocument()
  }, [labelsStyleUrl, dispatch])

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      // TODO: fix this. So weird!
      mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
      // TODO: show MB attribution text (not logo) on mobile
      className="mb-language-map"
      onLoad={(map) => {
        const features = map.target
          .querySourceFeatures(langSrcConfig.internalSrcID, {
            sourceLayer: langSrcConfig.layerId,
          })
          .map(({ properties }) => properties)

        dispatch({
          type: 'INIT_LANG_LAYER_FEATURES',
          payload: features,
        })
      }}
    >
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
                layout={{ visibility: isInActiveGroup ? 'visible' : 'none' }}
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
