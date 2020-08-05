// TODO: deal with this nightmare
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { FC, useContext } from 'react'
import { Source, Layer } from 'react-map-gl'

import { GlobalContext } from 'components'
import { LayerPropsPlusMeta } from './types'
import { langSrcConfig } from './config'

type SourceAndLayerType = {
  symbLayers: LayerPropsPlusMeta[]
  labelLayers: LayerPropsPlusMeta[]
  selFeatID: number
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
      type="vector"
      url={`mapbox://${langSrcConfig.tilesetId}`}
      promoteId="ID"
      id={langSrcConfig.internalSrcID}
    >
      {symbLayers.map((layer: LayerPropsPlusMeta) => {
        /* eslint-disable operator-linebreak */
        const paint = {
          ...layer.paint,
          'circle-radius': selFeatID
            ? ['match', ['get', 'ID'], [selFeatID], 15, 5]
            : layer.paint['circle-radius'],
        }
        /* eslint-enable operator-linebreak */
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
        const layout = {
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
