import React, { FC, useState, useContext } from 'react'
import MapGL from 'react-map-gl'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css'

import { GlobalContext } from 'components'
import { MAPBOX_TOKEN } from '../../config'
import { InitialMapState } from './types'
import { langLayerConfig } from './config'
import { LanguageLayer } from './LanguageLayer'

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const [viewport, setViewport] = useState({ latitude, longitude, zoom })
  const { state, dispatch } = useContext(GlobalContext)

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      // TODO: fix this. So weird!
      mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
      // TODO: show MB attribution text (not logo) on mobile
      className="mb-language-map"
      onLoad={(map) => {
        const features = map.target
          .querySourceFeatures('languages-src', {
            sourceLayer: langLayerConfig.layerId,
          })
          .map(({ properties }) => properties)

        dispatch({
          type: 'SET_LANG_LAYER_FEATURES',
          payload: features,
        })
      }}
    >
      <LanguageLayer
        tilesetId={langLayerConfig.tilesetId}
        styleUrl={`https://api.mapbox.com/styles/v1/${langLayerConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`}
      />
    </MapGL>
  )
}
