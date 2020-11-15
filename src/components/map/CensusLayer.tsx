import React, { FC, useEffect } from 'react'
import { useQuery, queryCache } from 'react-query'
import { Source, Layer } from 'react-map-gl'
import { Map } from 'mapbox-gl'

import * as utils from './utils'
import * as Types from './types'
import * as config from './config'

const { censusConfig } = config

export type ActiveField = keyof CensusLangField
export type CensusLayerProps = Pick<
  Types.BoundariesLayerProps,
  'beforeId' | 'source' | 'visible'
> & {
  map?: Map
  activeField?: ActiveField
}

// FIXME: NO MATCH:
// 36047990100 36061000100 36081990100 36085008900 36085990100

/**
 * Richmond, Kings, Queens, New York, Bronx
 * CENSUS IDs: 085, 047, 081, 061, 005
 * MB Boundaries: STATE + CENSUS: 36085, 36047, 36081, 36061, 36005
 */

type CensusLangField = {
  Arabic: number | typeof NaN
  Chinese: number | typeof NaN
  French: number | typeof NaN
  German: number | typeof NaN
  Korean: number | typeof NaN
  Russian: number | typeof NaN
  Spanish: number | typeof NaN
  Tagalog: number | typeof NaN
  Vietnamese: number | typeof NaN
}

type MbReadyCensusRow = {
  id: number // MB Boundaries' internal
  fips: string
} & CensusLangField

const censusLookupQueryID: Types.BoundariesInternalSrcID = 'tracts'

// function getColor(value: number): string {
//   if (value === 0) return 'hsl(240, 20%, 80%)'
//   if (value > 150) return 'hsl(240, 80%, 20%)'
//   if (value > 75) return 'hsl(240, 70%, 30%)'
//   if (value > 50) return 'hsl(240, 60%, 40%)'
//   if (value > 25) return 'hsl(240, 50%, 50%)'
//   if (value > 10) return 'hsl(240, 40%, 60%)'
//   if (value > 5) return 'hsl(240, 30%, 70%)'

//   return 'hsl(0, 0%, 89%)'
// }

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

export const CensusLayer: FC<CensusLayerProps> = (props) => {
  const { beforeId, source, visible, map, activeField = 'Arabic' } = props
  const { data, isFetching, error } = useQuery(censusLookupQueryID)
  const lookupData = data as MbReadyCensusRow[]

  useEffect(() => {
    queryCache.prefetchQuery(censusLookupQueryID, () =>
      utils.asyncAwaitFetch(config.censusConfig.lookupPath)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isFetching || !map) return

    lookupData.forEach((row, i) => {
      map.setFeatureState(
        {
          source: config.censusConfig.source.id,
          sourceLayer: config.censusLyrSrc['source-layer'],
          id: row.id,
        },
        {
          total: row[activeField],
        } as { total: number | typeof NaN }
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (error || isFetching) return null

  // Don't draw anything outside of 5-county region
  const listOfIDs = lookupData.map((record) => record.id)

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
