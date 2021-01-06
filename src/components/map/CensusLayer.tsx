import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'

import { CensusScope } from 'components/local/types'
import { CensusLayerProps } from './types'
import { useCensusSymb } from './hooks'
import { CENSUS_PROMOTE_ID_FIELD } from './config'

export const CensusLayer: FC<CensusLayerProps> = (props) => {
  const { sourceLayer, config, map, beforeId } = props
  const { layers, source } = config
  const censusScope = config.source.id as CensusScope
  const { fillPaint, visible, error, isLoading } = useCensusSymb(
    sourceLayer,
    censusScope,
    map
  )

  if (error || isLoading) return null // TODO: sentry

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Source {...source} type="vector" promoteId={CENSUS_PROMOTE_ID_FIELD}>
      {layers.map((layer) => (
        <Layer
          key={layer.id}
          beforeId={beforeId}
          {...layer}
          paint={layer.type === 'line' ? layer.paint : fillPaint}
          layout={{
            ...layer.layout,
            visibility: visible ? 'visible' : 'none',
          }}
        />
      ))}
    </Source>
  )
}
