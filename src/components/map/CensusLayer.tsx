import React, { FC, useEffect, useState } from 'react'
import { useQuery, queryCache } from 'react-query'
import { Source, Layer } from 'react-map-gl'
import { FillPaint } from 'mapbox-gl'
import * as stats from 'simple-statistics'

import { useMapToolsState } from 'components/context'
import { InterpRateOfChange } from 'components/map/types'
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

const setFill = (
  rateOfChange: InterpRateOfChange,
  highest: number
): FillPaint => {
  let rate: number[] = []

  // `interpolate` docs:
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#interpolate
  // if (rateOfChange === 'linear') rate = [rateOfChange]
  if (rateOfChange === 'exponential') rate = [0.5]
  else if (rateOfChange === 'cubic-bezier') rate = [0.85, 0.7, 0.65, 1]

  return {
    'fill-color': [
      'case',
      ['!=', ['feature-state', 'total'], NaN],
      [
        'interpolate',
        [rateOfChange, ...rate],
        ['feature-state', 'total'],
        0,
        'rgb(237, 248, 233)',
        highest,
        'rgb(0, 109, 44)',
      ],
      'rgba(255, 255, 255, 0)',
    ],
    'fill-opacity': 0.85,
  }
}

export const CensusLayer: FC<Types.CensusLayerProps> = (props) => {
  const { beforeId, source, map } = props
  const { data, isFetching, error } = useQuery(censusLookupQueryID)
  const lookupData = data as Types.MbReadyCensusRow[]
  const { censusField, censusRateOfChange } = useMapToolsState()
  const [censusFillPaint, setCensusFillPaint] = useState<FillPaint>({
    'fill-color': 'blue',
  })
  const [highest, setHighest] = useState<number>(0)

  useEffect(() => {
    queryCache.prefetchQuery(censusLookupQueryID, () =>
      utils.asyncAwaitFetch(config.censusConfig.lookupPath)
    )
  }, [])

  useEffect(() => {
    if (isFetching || !map || !censusField || !highest) return

    setCensusFillPaint(setFill(censusRateOfChange, highest))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, censusField, censusRateOfChange, highest])

  useEffect(() => {
    if (isFetching || !map || !censusField) return

    const valuesCurrField = lookupData.map((record) => record[censusField])
    setHighest(stats.max(valuesCurrField))

    // const means = ckmeans(valuesCurrField, 5)
    // const quant = stats.quantileRank(valuesCurrField, 0.5)

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
    // }, [censusField, lookupData, censusRateOfChange])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [censusField])

  if (error || isFetching || !censusField) return null

  // Don't draw anything outside of 5-county region
  const listOfIDs = lookupData.map((record) => record.id)
  const visible = censusField !== undefined && censusField !== ''

  return (
    <Source {...source} type="vector">
      {censusConfig.layers.map((layer) => (
        <Layer
          key={layer.id}
          {...layer}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          paint={layer.type === 'line' ? layer.paint : censusFillPaint}
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
