import React, { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Source, Layer } from 'react-map-gl'

import { reactQueryDefaults } from 'components/config'
import * as utils from './utils'
import * as Types from './types'

export const BoundariesLayer: FC<Types.BoundariesLayerProps> = (props) => {
  const { beforeId, source, layers, lookupPath, visible } = props
  const { data, isLoading, error } = useQuery(
    source.id,
    () => utils.asyncAwaitFetch<Types.BoundaryLookup[]>(lookupPath),
    reactQueryDefaults
  )
  const [recordIDs, setRecordIDs] = useState<number[]>()

  useEffect(() => {
    if (isLoading || !data) return

    setRecordIDs(data.map((record) => record.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  if (error || !recordIDs || !visible || isLoading) return null

  if (!visible) return null

  return (
    <Source {...source} type="vector">
      {layers.map((layer) => (
        <Layer
          key={layer.id}
          beforeId={beforeId}
          {...layer}
          layout={{ ...layer.layout }}
          filter={['in', ['id'], ['literal', recordIDs]]}
        />
      ))}
    </Source>
  )
}
