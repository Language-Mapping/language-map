import * as LocalTypes from 'components/local'
import * as Types from './types'

const tractsSrcId: LocalTypes.CensusScope = 'tract'
const pumaSrcID: LocalTypes.CensusScope = 'puma'
const minzoom = 8

export const pumaLyrSrc = {
  source: pumaSrcID,
  'source-layer': 'NYC_PUMA2017_5yr_langHome-0tfhwp',
  minzoom,
}

export const tractsLyrSrc = {
  source: tractsSrcId,
  'source-layer': 'NYC_tract2013_17_langHome-8cd347',
  minzoom,
}

// The feature-state approach came from:
// https://docs.mapbox.com/help/tutorials/data-joins-with-mapbox-boundaries/
const censusFill = {
  type: 'fill',
  paint: {
    'fill-color': [
      'case',
      ['!=', ['feature-state', 'total'], NaN],
      [
        'interpolate',
        ['linear'],
        ['feature-state', 'total'],
        4,
        'rgb(237, 248, 233)',
        140,
        'rgb(0, 109, 44)',
      ],
      'rgba(255, 255, 255, 0)', // TODO: transparent at least
    ],
    'fill-opacity': 0.8,
  },
}

const censusLine = {
  type: 'line',
  paint: { 'line-color': '#c2c2c2', 'line-opacity': 0.2 },
}

export const tractsConfig = {
  source: { id: tractsSrcId, url: 'mapbox://elalliance.5dh31p39' },
  layers: [
    { id: 'tracts-poly', ...tractsLyrSrc, ...censusFill },
    { id: 'tracts-line', ...tractsLyrSrc, ...censusLine },
  ],
} as Omit<Types.BoundaryConfig, 'lookupPath'>

export const pumaConfig = {
  source: { id: pumaSrcID, url: 'mapbox://elalliance.5tfrskw8' },
  layers: [
    { id: 'puma-poly', ...pumaLyrSrc, ...censusFill },
    { id: 'puma-line', ...pumaLyrSrc, ...censusLine },
  ],
} as Omit<Types.BoundaryConfig, 'lookupPath'>
