import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

import { pointStyle } from './map-style'

type LangLayerType = {
  tilesetId: string
  layerId: string
}

export const LanguageLayer: FC<LangLayerType> = ({ tilesetId, layerId }) => {
  // TODO: consolidate or remove, depending on how layer is hit from MB Styles
  const settings = {
    ...pointStyle,
    'source-layer': layerId,
  }

  return (
    <Source type="vector" url={`mapbox://${tilesetId}`} id="languages-src">
      {/* TODO: figure out why this doesn't work in TS. Looks like it wants
          a string, which is the case after Mapbox does its thing with `paint.
          circle-color`, but until then it's an array. */}
      {/* @ts-ignore */}
      <Layer {...settings} />
    </Source>
  )
}
