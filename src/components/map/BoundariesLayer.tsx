import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

import { neighbConfig, countiesConfig } from './config'

type BoundariesLayerProps = {
  beforeId?: string
}

export const BoundariesLayer: FC<BoundariesLayerProps> = (props) => {
  const { beforeId } = props

  return (
    <>
      <Source {...countiesConfig.source} type="vector">
        {countiesConfig.layers.map((layer) => (
          <Layer key={layer.id} beforeId={beforeId} {...layer} />
        ))}
      </Source>
      <Source {...neighbConfig.source} type="vector">
        {neighbConfig.layers.map((layer) => (
          <Layer key={layer.id} beforeId={beforeId} {...layer} />
        ))}
      </Source>
    </>
  )
}
