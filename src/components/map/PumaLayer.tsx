import React, { FC, useState, useEffect } from 'react'
import { Source, Layer } from 'react-map-gl'
import { FillPaint } from 'mapbox-gl'
import * as stats from 'simple-statistics'

import { useMapToolsState } from 'components/context'
import { pumaConfig, pumaLyrSrc } from './config'
import * as utils from './utils'
import * as Types from './types'

// TODO: set paint property (???)
// https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setpaintproperty

type PumaLayerProps = Pick<Types.CensusLayerProps, 'map'>

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const PumaLayer: FC<PumaLayerProps> = (props) => {
  const { map } = props
  const { pumaField } = useMapToolsState()
  const [fillPaint, setFillPaint] = useState<FillPaint>({
    'fill-color': 'blue',
  })
  const [highLow, setHighLow] = useState<{ high: number; low?: number }>()

  useEffect(() => {
    if (!map || !pumaField || !highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow.low))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pumaField, highLow])

  useEffect(() => {
    if (!map || !pumaField) return

    const features = map.querySourceFeatures(pumaLyrSrc.source, {
      sourceLayer: pumaLyrSrc['source-layer'],
    })
    // }) as { [key: string]: number }[]

    // debugger
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const valuesCurrField = features.map(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ properties }) => properties[pumaField]
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
      // debugger
      map.setFeatureState(
        {
          source: pumaLyrSrc.source,
          sourceLayer: pumaLyrSrc['source-layer'],
          id: row.id,
        },
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          total: (row.properties[pumaField] / max) * 100, // TODO: TS for "total"
        } as { total: number | typeof NaN }
      )
    })
    // }, [pumaField, lookupData, censusRateOfChange])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pumaField])

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Source {...pumaConfig.source} type="vector" promoteId="OBJECTID">
      {pumaConfig.layers.map((layer) => (
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
