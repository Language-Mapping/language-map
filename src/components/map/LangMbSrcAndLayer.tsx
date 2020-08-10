import React, { FC, useContext } from 'react'
import * as mbGlFull from 'mapbox-gl'
import { Source, Layer } from 'react-map-gl'

import { GlobalContext } from 'components'
import { LayerPropsPlusMeta } from './types'
import { mbStyleTileConfig } from './config'

type SourceAndLayerType = {
  symbLayers: LayerPropsPlusMeta[]
  labelLayers: LayerPropsPlusMeta[]
}

export const LangMbSrcAndLayer: FC<SourceAndLayerType> = ({
  symbLayers,
  labelLayers,
}) => {
  const { state } = useContext(GlobalContext)
  const { activeLangSymbGroupId, activeLangLabelId } = state

  // NOTE: it did not seem to work when using two different Styles with the same
  // dataset unless waiting until there is something to put into <Source>.
  return (
    <Source
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // promoteId is just not anywhere in the source...
      promoteId="ID"
      type="vector"
      url={`mapbox://${mbStyleTileConfig.tilesetId}`}
      id={mbStyleTileConfig.internalSrcID}
    >
      {symbLayers.map((layer: LayerPropsPlusMeta) => {
        let { paint } = layer
        const isInActiveGroup =
          layer.metadata['mapbox:group'] === activeLangSymbGroupId

        // Set selected feature stroke for all layers of `circle` type
        if (layer.type === 'circle') {
          paint = {
            ...paint,
            'circle-stroke-color': 'cyan',
            'circle-stroke-width': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              3,
              0,
            ],
          }
        }

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

        const layout: mbGlFull.AnyLayout = {
          ...layer.layout,
          visibility: isActiveLabel ? 'visible' : 'none',
        }

        return <Layer key={layer.id} {...layer} layout={layout} />
      })}
    </Source>
  )
}
