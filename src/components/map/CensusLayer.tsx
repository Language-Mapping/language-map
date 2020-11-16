import React, { FC, useEffect } from 'react'
import { useQuery, queryCache } from 'react-query'
import { Source, Layer } from 'react-map-gl'

import * as utils from './utils'
import * as Types from './types'
import * as config from './config'

const { censusConfig } = config
const censusLookupQueryID: Types.BoundariesInternalSrcID = 'tracts'

// FIXME: NO MATCH:
// 36047990100 36061000100 36081990100 36085008900 36085990100

/**
 * Richmond, Kings, Queens, New York, Bronx
 * CENSUS IDs: 085, 047, 081, 061, 005
 * MB Boundaries: STATE + CENSUS: 36085, 36047, 36081, 36061, 36005
 */

// TODO: ?
// Check if `statesData` source is loaded? // TODO: ???
// function setAfterLoad(e) {
//   if (e.sourceId === 'statesData' && e.isSourceLoaded) {
//     setStates()
//     map.off('sourcedata', setAfterLoad)
//   }
// }

// // If `statesData` source is loaded, call `setStates()`.
// if (map.isSourceLoaded('statesData')) {
//   setStates()
// } else {
//   map.on('sourcedata', setAfterLoad)
// }

export const CensusLayer: FC<Types.CensusLayerProps> = (props) => {
  const { beforeId, source, map, censusField } = props
  const { data, isFetching, error } = useQuery(censusLookupQueryID)
  const lookupData = data as Types.MbReadyCensusRow[]

  useEffect(() => {
    queryCache.prefetchQuery(censusLookupQueryID, () =>
      utils.asyncAwaitFetch(config.censusConfig.lookupPath)
    )
  }, [])

  useEffect(() => {
    if (isFetching || !map || !censusField) return

    lookupData.forEach((row, i) => {
      map.setFeatureState(
        {
          source: config.censusConfig.source.id,
          sourceLayer: config.censusLyrSrc['source-layer'],
          id: row.id,
        },
        {
          total: row[censusField],
        } as { total: number | typeof NaN }
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [censusField, lookupData])

  if (error || isFetching) return null

  // Don't draw anything outside of 5-county region
  const listOfIDs = lookupData.map((record) => record.id)
  const visible = censusField !== undefined && censusField !== ''

  return (
    <Source {...source} type="vector">
      {censusConfig.layers.map((layer) => (
        <Layer
          key={layer.id}
          {...layer}
          beforeId={beforeId}
          layout={{
            ...layer.layout,
            visibility: visible ? 'visible' : 'none',
          }}
          filter={['in', ['id'], ['literal', listOfIDs]]}
        />
      ))}
    </Source>
  )
}
