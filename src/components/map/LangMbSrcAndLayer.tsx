import React, { FC, useContext } from 'react'
import * as mbGlFull from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { GlobalContext } from 'components'
import { LayerPropsPlusMeta } from './types'
import { langSrcConfig } from './config'

type SourceAndLayerType = {
  symbLayers: LayerPropsPlusMeta[]
  labelLayers: LayerPropsPlusMeta[]
  selFeatID: number | null
}

export const LangMbSrcAndLayer: FC<SourceAndLayerType> = ({
  symbLayers,
  labelLayers,
  selFeatID,
}) => {
  const { state } = useContext(GlobalContext)
  const { activeLangSymbGroupId, activeLangLabelId } = state

  return (
    <Source
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="ID"
      type="vector"
      url={`mapbox://${langSrcConfig.tilesetId}`}
      id={langSrcConfig.internalSrcID}
    >
      {symbLayers.map((layer: LayerPropsPlusMeta) => {
        let radius = 5

        // Something screwy with TS defs for paint...
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        if (selFeatID) {
          // @ts-ignore
          radius = ['match', ['get', 'ID'], [selFeatID], 15, 5]
        } else if (layer.paint && layer.paint['circle-radius']) {
          // @ts-ignore
          radius = layer.paint['circle-radius']
        }
        /* eslint-enable @typescript-eslint/ban-ts-comment */
        const paint: mbGlFull.CirclePaint = {
          ...layer.paint,
          'circle-radius': radius,
        }

        const isInActiveGroup =
          layer.metadata['mapbox:group'] === activeLangSymbGroupId

        return (
          <Layer
            key={layer.id}
            {...layer}
            // TODO: some kind of transition/animation on switch
            layout={{
              visibility: isInActiveGroup ? 'visible' : 'none',
            }}
            paint={paint}
          />
        )
      })}
      {labelLayers.map((layer: LayerPropsPlusMeta) => {
        const isActiveLabel = layer.id === activeLangLabelId

        // TODO: some kind of transition/animation on switch
        const layout: mbGlFull.AnyLayout = {
          ...layer.layout,
          visibility: isActiveLabel ? 'visible' : 'none',
        }

        return (
          <Layer
            key={layer.id}
            id={layer.id}
            type={layer.type}
            source={layer.source}
            source-layer={layer['source-layer']}
            paint={layer.paint}
            layout={layout}
          />
        )
      })}
    </Source>
  )
}
