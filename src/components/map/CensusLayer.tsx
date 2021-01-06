import React, { FC, useState, useEffect } from 'react'
import { Source, Layer } from 'react-map-gl'
import { FillPaint } from 'mapbox-gl'
import * as stats from 'simple-statistics'
import { useQuery } from 'react-query'

import { useMapToolsState } from 'components/context'
import { SheetsReactQueryResponse } from 'components/config/types'
import { CensusScope } from 'components/local/types'
import { reactQueryDefaults } from 'components/config'
import { tableEndpoints } from '../local/config'
import { sheetsToJSON } from '../../utils'

import * as utils from './utils'
import { CensusLayerProps, PreppedCensusTableRow } from './types'

export const CensusLayer: FC<CensusLayerProps> = (props) => {
  const { sourceLayer, config, map, beforeId } = props
  const { layers, source } = config
  const censusScope = config.source.id as CensusScope
  const { censusActiveField } = useMapToolsState()
  const field = censusActiveField?.id
  const scope = censusActiveField?.scope
  const visible = field && censusScope === scope

  // TODO: prevent this from happening before it's actually used
  const { data, error, isLoading } = useQuery(
    `${censusScope}-table`,
    () => utils.asyncAwaitFetch(tableEndpoints[censusScope]),
    reactQueryDefaults
  ) as SheetsReactQueryResponse
  const [fillPaint, setFillPaint] = useState<FillPaint>({
    'fill-color': 'transparent', // mitigates the brief lag before load
  })
  const [highLow, setHighLow] = useState<{ high: number; low?: number }>()
  const [tableRows, setTableRows] = useState<PreppedCensusTableRow[]>()

  useEffect(() => {
    if (isLoading || !data) return

    /* eslint-disable array-bracket-newline */
    const tableRowsPrepped = sheetsToJSON<PreppedCensusTableRow>(data.values, [
      'GEOID',
    ])

    setTableRows(tableRowsPrepped)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    if (!map || !tableRows || !field || !visible) return

    const valuesCurrField = tableRows.map((row) => row[field])
    const means = stats.ckmeans(valuesCurrField, 5)
    const firstItemLastClass = means[4][0]
    const max = stats.max(valuesCurrField)

    // TODO: rm if not using min
    // low: (firstItemLastClass / stats.min(valuesCurrField)) * 100,
    setHighLow({ high: (firstItemLastClass / max) * 100 })

    tableRows.forEach((row) => {
      const featConfig = { source: censusScope, sourceLayer, id: row.GEOID }
      const total = row[field]

      map.setFeatureState(featConfig, {
        total: (total / max) * 100,
      } as { total: number })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  useEffect(() => {
    if (!highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow.low))
  }, [highLow])

  if (error || isLoading) return null // TODO: sentry

  const promoteIDfield = 'GEOID' // tell MB not to use default `id` as unique ID

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Source {...source} type="vector" promoteId={promoteIDfield}>
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
