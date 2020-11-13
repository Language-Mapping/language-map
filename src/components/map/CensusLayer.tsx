import React, { FC, useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { Source, Layer } from 'react-map-gl'

import * as utils from './utils'
import * as Types from './types'
import * as config from './config'

const { censusConfig } = config

export type CensusLayerProps = Pick<
  Types.BoundariesLayerProps,
  'beforeId' | 'source' | 'visible'
>

export const CensusLayer: FC<CensusLayerProps> = (props) => {
  const { beforeId, source, visible } = props
  const { data, isFetching, error } = useQuery(source.id)
  // const [recordIDs, setRecordIDs] = useState<number[]>()
  const [, setRecordIDs] = useState<number[]>()

  useEffect(() => {
    queryCache.prefetchQuery('census-lookup', () =>
      utils.asyncAwaitFetch(config.countiesConfig.lookupPath)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isFetching) return

    const lookup = data as Types.BoundaryLookup[]
    const listOfIDs = lookup.map((record) => record.id)

    setRecordIDs(listOfIDs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  // if (error || !recordIDs) return null // TODO: restore when JSON ready
  if (error) return null // TODO: restore when JSON ready

  return (
    <Source {...source} type="vector">
      {censusConfig.layers.map((layer) => (
        <Layer
          key={layer.id}
          beforeId={beforeId}
          {...layer}
          layout={{
            ...layer.layout,
            visibility: visible ? 'visible' : 'none',
          }}
          // filter={['in', ['id'], ['literal', recordIDs]]}
        />
      ))}
    </Source>
  )
}
