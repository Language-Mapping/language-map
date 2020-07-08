import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

import { pointStyle } from './map-style'

export const LanguageLayer: FC = () => {
  return (
    <Source
      type="vector"
      url="mapbox://rhododendron.2knla7ts"
      id="languages-src"
    >
      {/* TODO: figure out why this doesn't work in TS. Looks like it wants
          a string, which is the case after Mapbox does its thing with `paint.
          circle-color`, but until then it's an array. */}
      {/* @ts-ignore */}
      <Layer {...pointStyle} />
    </Source>
  )
}
