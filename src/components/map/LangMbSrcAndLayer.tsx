import React, { FC } from 'react'
import * as mbGlFull from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { LayerPropsNonBGlayer } from './types'
import { mbStyleTileConfig } from './config'

type SourceAndLayerComponent = {
  symbLayers: LayerPropsNonBGlayer[]
  labelLayers: LayerPropsNonBGlayer[]
  activeLangSymbGroupId: string
  activeLangLabelId: string
}

const commonCirclePaint = {
  'circle-stroke-color': 'cyan',
  'circle-stroke-width': [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    3,
    0,
  ],
} as mbGlFull.CirclePaint

// NOTE: it did not seem to work when using two different Styles with the same
// dataset unless waiting until there is something to put into <Source>.
export const LangMbSrcAndLayer: FC<SourceAndLayerComponent> = ({
  symbLayers,
  labelLayers,
  activeLangSymbGroupId,
  activeLangLabelId,
}) => {
  return (
    <Source
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="ID"
      type="vector"
      url={`mapbox://${mbStyleTileConfig.tilesetId}`}
      id={mbStyleTileConfig.internalSrcID}
    >
      {symbLayers.map((layer: LayerPropsNonBGlayer) => {
        let { paint, layout } = layer
        const isInActiveGroup =
          layer.metadata['mapbox:group'] === activeLangSymbGroupId

        // Hide if not in active symbology group
        layout = {
          ...layout,
          visibility: isInActiveGroup ? 'visible' : 'none',
        }

        // Set selected feature stroke for all layers of `circle` type
        if (layer.type === 'circle') {
          paint = { ...paint, ...commonCirclePaint }
        } else if (layer.type === 'symbol') {
          // TODO: change symbol size (???) for selected feat. Evidently cannot
          // set layout properties base on feature-state though, so maybe this:
          // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setlayoutproperty
          // 0.5 good with 24x24 SVG if there is a background circle. Otherwise
          // a little smaller is better.
          layout = { ...layout, 'icon-size': 0.4 }
        }

        return (
          // TODO: some kind of transition/animation on switch
          <Layer
            key={layer.id}
            {...layer}
            source-layer={mbStyleTileConfig.layerId}
            layout={layout}
            paint={paint}
          />
        )
      })}
      {labelLayers.map((layer: LayerPropsNonBGlayer) => {
        const isActiveLabel = layer.id === activeLangLabelId

        const layout: mbGlFull.AnyLayout = {
          ...layer.layout,
          visibility: isActiveLabel ? 'visible' : 'none',
        }

        return (
          <Layer
            key={layer.id}
            {...layer}
            source-layer={mbStyleTileConfig.layerId}
            layout={layout}
          />
        )
      })}
    </Source>
  )
}
