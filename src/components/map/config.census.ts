// Tell MB not to use default `id` as unique ID
export const CENSUS_PROMOTE_ID_FIELD = 'GEOID'

// The feature-state approach came from:
// https://docs.mapbox.com/help/tutorials/data-joins-with-mapbox-boundaries/
const fillPaint = {
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

const linePaint = { 'line-color': '#c2c2c2', 'line-opacity': 0.2 }

export const censusLayersConfig = {
  puma: {
    linePaint,
    routePath: '/Census/puma/:field/:id',
    sourceID: 'puma',
    sourceLayer: 'puma',
    tableName: 'puma',
    url: 'mapbox://elalliance.ckmyzhyit0n4b21mxt9rdkeiy-7w6dn',
    visContextKey: 'showNeighbs',
    fillPaint,
  },
  tract: {
    linePaint,
    routePath: '/Census/tract/:field/:id',
    sourceID: 'tract',
    sourceLayer: 'tract',
    tableName: 'tract',
    url: 'mapbox://elalliance.ckmz05zuf04p421nltfeih779-91sof',
    visContextKey: 'showCounties',
    fillPaint,
  },
}
