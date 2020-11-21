import React, { FC, useState, useEffect } from 'react'
import { Source, Layer } from 'react-map-gl'
import { FillPaint, MapboxGeoJSONFeature, MapSourceDataEvent } from 'mapbox-gl'

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
} & Pick<Types.SpatialPanelProps, 'mapRef'>

// TODO: rename component and file
export const PumaLayer: FC<CensusLayerProps> = (props) => {
  const { sourceLayer, config, stateKey, map } = props
  const { layers, source } = config
  const field = useMapToolsState()[stateKey]
  const [fillPaint, setFillPaint] = useState<FillPaint>({
    'fill-color': 'transparent', // mitigates the brief lag before load
  })
  const [highLow, setHighLow] = useState<{ high: number; low?: number }>()
  const visible = field !== undefined && field !== ''
  const [features, setFeatures] = useState<MapboxGeoJSONFeature[]>([])
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    function onSourceData(e: MapSourceDataEvent) {
      if (!map || !e.isSourceLoaded || e.sourceId !== config.source.id) return

      const theFeats = map?.querySourceFeatures(source.id, { sourceLayer })

      setFeatures(theFeats || [])
      map.off('sourcedata', onSourceData)
      setLoaded(true)
    }

    if (!features.length) map?.on('sourcedata', onSourceData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  // TODO: into utils
  useEffect(() => {
    if (!map || !loaded || !field) return

    const valuesCurrField = features.map(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ properties }) => properties[field]
    )
    const means = stats.ckmeans(valuesCurrField, 5)
    const firstItemLastClass = means[4][0]
    const max = stats.max(valuesCurrField)

    // TODO: rm if not using min
    // low: (firstItemLastClass / stats.min(valuesCurrField)) * 100,
    setHighLow({ high: (firstItemLastClass / max) * 100 })

    features.forEach((row, i) => {
      const featConfig = { source: config.source.id, sourceLayer, id: row.id }

      map.setFeatureState(featConfig, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        total: (row.properties[field] / max) * 100, // TODO: TS for "total"
      } as { total: number })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, loaded])

  useEffect(() => {
    if (!highLow) return

    setFillPaint(utils.setInterpolatedFill(highLow.high, highLow.low))
  }, [highLow])

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Source {...source} type="vector" promoteId="OBJECTID">
      {layers.map((layer) => (
        <Layer
          key={layer.id}
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
