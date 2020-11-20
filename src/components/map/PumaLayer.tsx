import React, { FC, useState, useEffect } from 'react'
import { Source, Layer } from 'react-map-gl'
import { FillPaint } from 'mapbox-gl'
import * as stats from 'simple-statistics'

import { useMapToolsState, InitialMapToolsState } from 'components/context'
import * as utils from './utils'
import * as Types from './types'

// TODO: set paint property (???)
// https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

type CensusLayerProps = Pick<Types.CensusLayerProps, 'map'> & {
  sourceLayer: string
  stateKey: keyof InitialMapToolsState
  config: Omit<Types.BoundaryConfig, 'lookupPath'>
}

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const PumaLayer: FC<CensusLayerProps> = (props) => {
  const { map, sourceLayer, config, stateKey } = props
  const { layers, source } = config
  const field = useMapToolsState()[stateKey]
  const [fillPaint, setFillPaint] = useState<FillPaint>({
    'fill-color': 'blue',
  })
  const [highLow, setHighLow] = useState<{ high: number; low?: number }>()

  useEffect(() => {
    if (!map || !field || !highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow.low))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, highLow])

  useEffect(() => {
    if (!map || !field) return

    const features = map.querySourceFeatures(source.id, { sourceLayer })
    const valuesCurrField = features.map(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ properties }) => properties[field]
    )
    const means = stats.ckmeans(valuesCurrField, 5)
    const firstItemLastClass = means[4][0]
    const max = stats.max(valuesCurrField)

    setHighLow({
      high: (firstItemLastClass / max) * 100,
      // TODO: rm if not using min
      // low: (firstItemLastClass / stats.min(valuesCurrField)) * 100,
    })

    features.forEach((row, i) => {
      map.setFeatureState(
        {
          source: config.source.id,
          sourceLayer,
          id: row.id,
        },
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          total: (row.properties[field] / max) * 100, // TODO: TS for "total"
        } as { total: number }
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Source {...source} type="vector" promoteId="OBJECTID">
      {layers.map((layer) => (
        <Layer
          key={layer.id}
          // beforeId={beforeId}
          {...layer}
          paint={layer.type === 'line' ? layer.paint : fillPaint}
          layout={{
            ...layer.layout,
            // visibility: visible ? 'visible' : 'none',
          }}
        />
      ))}
    </Source>
  )
}
