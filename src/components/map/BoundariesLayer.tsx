import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

import { neighbConfig } from './config'

type BoundariesLayerProps = {
  beforeId?: string
}

export const BoundariesLayer: FC<BoundariesLayerProps> = (props) => {
  const { beforeId } = props

  return (
    <Source {...neighbConfig.source} type="vector">
      {neighbConfig.layers.map((layer) => (
        <Layer key={layer.id} minzoom={9} beforeId={beforeId} {...layer} />
      ))}
    </Source>
  )
}
