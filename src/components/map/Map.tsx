import React, { FC, useState, useContext } from 'react'
import MapGL from 'react-map-gl'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css'

// TODO: move to map-specific config file along with anything else that is
// project-specific in order to promote flexibility and reusability in case
// another project wants this.
import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { GlobalContext } from 'components'
import { LanguageLayer } from 'components/map'
import { InitialMapState } from './types'
import { langLayerConfig } from './config'

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const [viewport, setViewport] = useState({ latitude, longitude, zoom })
  const { dispatch, state } = useContext(GlobalContext)

  return (
    <MapGL
      {...viewport}
      width="100%"
      height="100%"
      // TODO: fix this. So weird!
      mapStyle={`mapbox://styles/mapbox/${state.baselayer}-v9`}
      onViewportChange={setViewport}
      mapboxApiAccessToken={mapboxApiAccessToken}
      // TODO: show MB attribution text (not logo) on mobile
      className="mb-language-map"
      onLoad={(mapObject) => {
        const features = mapObject.target
          .querySourceFeatures('languages-src', {
            sourceLayer: langLayerConfig.layerId,
          })
          .map(({ properties }) => properties)

        // TODO: test perf. Seems noticeably slower with all this data in state.
        dispatch({
          type: 'SET_LANG_LAYER_FEATURES',
          payload: features,
        })
      }}
    >
      <LanguageLayer
        tilesetId={langLayerConfig.tilesetId}
        layerId={langLayerConfig.layerId}
      />
    </MapGL>
  )
}
