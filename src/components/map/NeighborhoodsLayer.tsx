import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { Source, Layer } from 'react-map-gl'
import { FillPaint } from 'mapbox-gl'

import { useMapToolsState } from 'components/context'
import { PolygonLayerProps } from './types'
import { nonCensusPolygonConfig } from './config.non-census-poly'
import { SelectedPolygon } from './SelectedPolygon'

// Handy remnant from Boundaries layers:
// filter={['in', ['id'], ['literal', recordIDs]]}

export const PolygonLayer: FC<PolygonLayerProps> = (props) => {
  const { beforeId, configKey } = props
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore // TODO: come on
  const layerConfig = nonCensusPolygonConfig[configKey]
  const { sourceID, sourceLayer, routePath, visContextKey } = layerConfig
  const { url, fillPaint, linePaint, selLineColor, selFillColor } = layerConfig
  // @ts-ignore
  const visible = useMapToolsState()[visContextKey]
  /* eslint-enable @typescript-eslint/ban-ts-comment */

  return (
    <Source
      id={sourceID}
      url={url}
      type="vector"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="name"
    >
      <Layer
        // TODO: rm if layer order is never important
        id={`${sourceID}-placeholder`}
        type="background"
        paint={{ 'background-opacity': 0 }}
      />
      <Layer
        id={`${sourceID}-poly`}
        source={sourceID}
        source-layer={sourceLayer}
        paint={fillPaint as FillPaint}
        type="fill"
        beforeId={beforeId}
        layout={{ visibility: visible ? 'visible' : 'none' }}
      />
      <Layer
        id={`${sourceID}-line`}
        source={sourceID}
        source-layer={sourceLayer}
        paint={linePaint}
        type="line"
        beforeId={beforeId}
        layout={{ visibility: visible ? 'visible' : 'none' }}
      />
      <Route path={routePath} exact>
        <SelectedPolygon
          {...props}
          selLineColor={selLineColor}
          selFillColor={selFillColor}
        />
      </Route>
    </Source>
  )
}
