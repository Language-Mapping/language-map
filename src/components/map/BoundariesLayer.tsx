import React, { FC, useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { Source, Layer } from 'react-map-gl'

import * as utils from './utils'
import * as MapTypes from './types'

type BoundariesLayerProps = {
  visible: boolean
  beforeId?: string
} & MapTypes.BoundaryConfig

export const BoundariesLayer: FC<BoundariesLayerProps> = (props) => {
  const { beforeId, source, layers, lookupPath, visible } = props
  const { data, isFetching, error } = useQuery(source.id)
  const lookup = data as MapTypes.BoundaryLookup[]
  const [recordIDs, setRecordIDs] = useState<number[]>()

  useEffect(() => {
    queryCache.prefetchQuery(source.id, () => utils.asyncAwaitFetch(lookupPath))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isFetching) return

    const listOfIDs = lookup.map((record) => record.feature_id)

    setRecordIDs(listOfIDs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  if (error || !recordIDs) return null

  return (
    <Source {...source} type="vector">
      {layers.map((layer) => (
        <Layer
          key={layer.id}
          beforeId={beforeId}
          {...layer}
          layout={{
            ...layer.layout,
            visibility: visible ? 'visible' : 'none',
          }}
          filter={['in', ['id'], ['literal', recordIDs]]}
        />
      ))}
    </Source>
  )
}
