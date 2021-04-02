import * as LocalTypes from 'components/local'
import * as Types from './types'

const tractSrcId: LocalTypes.CensusScope = 'tract'
const pumaSrcID: LocalTypes.CensusScope = 'puma'
const minzoom = 8

// Tell MB not to use default `id` as unique ID
export const CENSUS_PROMOTE_ID_FIELD = 'GEOID'

export const pumaLyrSrc = {
  source: pumaSrcID,
  'source-layer': pumaSrcID,
  minzoom,
}

export const tractLyrSrc = {
  source: tractSrcId,
  'source-layer': tractSrcId,
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

export const tractConfig = {
  source: {
    id: tractSrcId,
    url: 'mapbox://elalliance.ckmz05zuf04p421nltfeih779-91sof',
  },
  layers: [
    { id: 'tract-poly', ...tractLyrSrc, ...censusFill },
    { id: 'tract-line', ...tractLyrSrc, ...censusLine },
  ],
} as Omit<Types.BoundaryConfig, 'lookupPath'>

export const pumaConfig = {
  source: {
    id: pumaSrcID,
    url: 'mapbox://elalliance.ckmyzhyit0n4b21mxt9rdkeiy-7w6dn',
  },
  layers: [
    { id: 'puma-poly', ...pumaLyrSrc, ...censusFill },
    { id: 'puma-line', ...pumaLyrSrc, ...censusLine },
  ],
} as Omit<Types.BoundaryConfig, 'lookupPath'>
