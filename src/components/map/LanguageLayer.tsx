import React, { FC, useEffect, useState, useContext } from 'react'
import { Source, Layer } from 'react-map-gl'

import { GlobalContext } from 'components'
import { MetadataGroupType, LayerWithMetadata } from './types'
import { createMapLegend } from '../../utils'

type LangLayerType = {
  tilesetId: string
  styleUrl: string
}

type MbResponseType = {
  metadata: {
    'mapbox:groups': MetadataGroupType
  }
  layers: LayerWithMetadata[]
}

export const LanguageLayer: FC<LangLayerType> = ({ tilesetId, styleUrl }) => {
  const { state, dispatch } = useContext(GlobalContext)
  const { activeLangSymbGroupId } = state
  const [layers, setLayers] = useState<LayerWithMetadata[]>([])

  useEffect(() => {
    // TODO: react-query or, at a minimum, get this into utils and maybe run it
    // higher up the tree instead.
    async function getMbStyleDocument() {
      const response = await fetch(styleUrl)
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
      dispatch({ type: 'SET_LANG_LAYER_SYMBOLOGY', payload: firstGroupId })

      // Kind of a shaky check to exclude the single-color BG layer used for
      // editing contrast in MB Studio. It would also exclude any non-grouped
      // layers that we DO want, so probably best to make it a rule that they
      // are all grouped if they are to be included as a symb option here.
      const notTheBgLayer = allLayers.filter(
        (layer: LayerWithMetadata) => layer.metadata
      )

      setLayers(notTheBgLayer)
    }

    getMbStyleDocument()
  }, [styleUrl, dispatch])

  useEffect(() => {
    const layersInActiveGroup = layers.filter(
      (layer: LayerWithMetadata) =>
        layer.metadata['mapbox:group'] === activeLangSymbGroupId
    )

    const legend = createMapLegend(layersInActiveGroup)

    dispatch({
      type: 'SET_LANG_LAYER_LEGEND',
      payload: legend,
    })
  }, [activeLangSymbGroupId, layers, dispatch])

  if (!layers || !layers.length) {
    return null
  }

  return (
    <Source type="vector" url={`mapbox://${tilesetId}`} id="languages-src">
      {layers.map((layer: LayerWithMetadata) => {
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
    </Source>
  )
}
