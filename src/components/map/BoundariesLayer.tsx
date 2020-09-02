//
//
//
// TODO: DEAL WITH THIS GIGANTIC MESS
//
//
//

import React, { FC } from 'react'
import { Source, Layer } from 'react-map-gl'
// import {  AnyLayout } from 'mapbox-gl'

// import { LayerPropsNonBGlayer } from './types'
// import { mbStyleTileConfig } from './config'

// Set it up:
// https://docs.mapbox.com/mapbox-gl-js/example/query-similar-features/
// https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
// https://bl.ocks.org/lobenichou/896118d8014c291c6c63b53f7ecafb28

// const neighbLayerConfig = {
//   id: 'neighb-fill',
//   type: 'fill',
//   paint: { 'fill-color': 'red', 'fill-opacity': 0.2 },
//   'source-layer': 'boundaries_locality_4',
//   // maxzoom: 12,
//   // source: 'neighb-poly',
//   // promoteId: 'waterway-label',
// }

// const cityLayerConfig = {
//   id: 'city-fill',
//   type: 'fill',
//   paint: { 'fill-color': 'blue', 'fill-opacity': 0.2 },
//   minzoom: 8,
//   'source-layer': 'boundaries_locality_2',
//   // source: 'city-poly',
// }

const ourNeighbs = {
  id: 'our-neighbs',
  type: 'fill',
  paint: {
    'fill-color': 'indigo',
    'fill-opacity': 0.24,
  },
  'source-layer': 'neighborhoods-09jg0v',
  // minzoom: 8,
  // source: 'city-poly',
}

const ourNeighbsLine = {
  id: 'our-neighbs-line',
  type: 'line',
  paint: {
    'line-color': 'indigo',
    'line-opacity': 0.4,
  },
  // promoteId:'our-'
  'source-layer': 'neighborhoods-09jg0v',
  // minzoom: 8,
  // source: 'city-poly',
}

// WE NEED TWO POLYGON LAYERS:
// 1. loc2 - cities/CDPs with parent_1 = USLOC17W but NOT an ID of USLOC23651000
// 2. loc4 - neighborhoods with parent_2 = USLOC23651000

// ID: elalliance.2qroh9fu
// Layer ID: neighborhoods-09jg0v

export const BoundariesLayer: FC = () => {
  return (
    <>
      {/* TODO: url and id into config! */}
      <Source type="vector" url="mapbox://elalliance.2qroh9fu" id="neighb-poly">
        <Layer {...ourNeighbsLine} />
        <Layer {...ourNeighbs} />
      </Source>
    </>
  )
}
