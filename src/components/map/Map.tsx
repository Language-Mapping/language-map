import React, { FC, useState, useContext } from 'react'
import MapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// TODO: move to map-specific config file along with anything else that is
// project-specific in order to promote flexibility and reusability in case
// another project wants this.
import { MAPBOX_TOKEN as mapboxApiAccessToken } from 'config'
import { InitialMapState } from './types'
import { GlobalContext } from 'components'
import { LanguageLayer } from 'components/map'

export const Map: FC<InitialMapState> = ({ latitude, longitude, zoom }) => {
  const [viewport, setViewport] = useState({ latitude, longitude, zoom })
  const { dispatch } = useContext(GlobalContext)

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={mapboxApiAccessToken}
      onLoad={(mapObject) => {
        const features = mapObject.target
          .querySourceFeatures('languages-src', {
            // MB tileset Layer ID, not the custom `id`
            sourceLayer: 'langsNY_06242020-2lztil',
          })
          .map(({ properties }) => properties)

        // TODO: test perf. Seems noticeably slower with all this data in state.
        dispatch({
          type: 'SET_LANG_LAYER_FEATURES',
          payload: features,
        })
      }}
    >
      <LanguageLayer />
    </MapGL>
  )
}
