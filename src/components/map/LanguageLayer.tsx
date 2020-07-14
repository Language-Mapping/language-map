import React, { FC, useEffect, useState, useContext } from 'react'
import { Source, Layer, LayerProps } from 'react-map-gl'

import { GlobalContext } from 'components'
import { getGroupNames } from '../../utils'

type LangLayerType = {
  tilesetId: string
  styleUrl: string
}

type MetadataGroupType = {
  [idHash: string]: {
    name: string
    collapsed: boolean
  }
}

type MetadataGroupsType = {
  'mapbox:groups': MetadataGroupType
}

type MbResponseType = {
  metadata: MetadataGroupsType
  layers: LayerProps[]
}

export const LanguageLayer: FC<LangLayerType> = ({ tilesetId, styleUrl }) => {
  const { dispatch } = useContext(GlobalContext)
  const [layersInStyleDoc, setLayers] = useState<LayerProps[]>([])

  useEffect(() => {
    async function getStyleDocument() {
      const response = await fetch(styleUrl)
      const { metadata, layers }: MbResponseType = await response.json()

      dispatch({
        type: 'SET_LANG_LAYER_SYMB_OPTIONS',
        payload: getGroupNames(metadata['mapbox:groups']),
      })

      setLayers(layers)
    }

    getStyleDocument()
  }, [styleUrl, dispatch])

  if (!layersInStyleDoc || !layersInStyleDoc.length) {
    return null
  }

  return (
    <Source type="vector" url={`mapbox://${tilesetId}`} id="languages-src">
      {layersInStyleDoc.map((layer: LayerProps) => (
        <Layer key={layer.id} {...layer} />
      ))}
    </Source>
  )
}
