import * as Types from './types'

// `symbol-sort-order` useful maybe:
// https://stackoverflow.com/a/59103558/1048518
const neighbPaint = {
  'fill-color': 'orange',
  'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    0.44,
    ['boolean', ['feature-state', 'hover'], false],
    0.29,
    0.14,
  ],
}

const censusSrcID = 'tract'
const censusLyrSrc = {
  source: censusSrcID,
  'source-layer': 'boundaries_stats_4',
  minzoom: 9.5,
}

// TODO: if the missing "Sheepshead Bay" polygon is added to Boundaries by MB,
// then the lookup table for this layer will need to be updated.
const neighbSrcID = 'neighborhoods'
const neighbLyrSrc = {
  source: neighbSrcID,
  'source-layer': 'boundaries_locality_4',
  minzoom: 8,
}

const countiesSrcID = 'counties'
const countiesLyrSrc = {
  source: countiesSrcID,
  'source-layer': 'boundaries_admin_2',
  minzoom: 6, // thanks Suffolk County
}

export const censusConfig = {
  lookupPath: '/data/lookup-tables/sta4-v3-new-york.json',
  source: {
    id: censusSrcID,
    url: 'mapbox://mapbox.boundaries-sta4-v3',
  },
  layers: [
    {
      id: 'census-poly',
      type: 'fill',
      paint: {
        'fill-color': 'purple',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          0.44,
          ['boolean', ['feature-state', 'hover'], false],
          0.29,
          0.14,
        ],
      },
      ...censusLyrSrc,
    },
    {
      id: 'census-line',
      type: 'line',
      ...censusLyrSrc,
      paint: {
        'line-color': 'purple',
        'line-opacity': 0.4,
      },
    },
  ],
} as Types.BoundaryConfig

export const neighbConfig = {
  lookupPath: '/data/lookup-tables/loc4-v3-new-york.json',
  source: {
    id: neighbSrcID,
    url: 'mapbox://mapbox.boundaries-loc4-v3',
  },
  layers: [
    {
      id: 'neighb-poly',
      type: 'fill',
      paint: neighbPaint,
      ...neighbLyrSrc,
    },
    {
      id: 'neighb-line',
      type: 'line',
      ...neighbLyrSrc,
      paint: {
        'line-color': 'orange',
        'line-opacity': 0.4,
      },
    },
  ],
} as Types.BoundaryConfig

export const countiesConfig = {
  lookupPath: '/data/lookup-tables/adm2-v3-counties.json',
  source: {
    id: countiesSrcID,
    url: 'mapbox://mapbox.boundaries-adm2-v3',
  },
  layers: [
    {
      id: 'counties-poly',
      type: 'fill',
      paint: neighbPaint,
      ...countiesLyrSrc,
    },
    {
      id: 'counties-line',
      type: 'line',
      ...countiesLyrSrc,
      paint: {
        'line-color': 'orange',
        'line-opacity': 0.4,
      },
    },
  ],
} as Types.BoundaryConfig

export const boundariesLayerIDs = [
  neighbConfig.layers[0].id,
  countiesConfig.layers[0].id,
]

export const countiesSrcId = countiesConfig.source.id
export const neighSrcId = neighbConfig.source.id
export const countiesPolyID = countiesConfig.layers[0]['source-layer']
export const neighPolyID = neighbConfig.layers[0]['source-layer']

// If using Boundaries... WE NEED TWO POLYGON LAYERS:
// boundaries_locality_2 and boundaries_locality_4:
// loc2: cities/CDPs with parent_1 = USLOC17W but NOT an ID of USLOC23651000
// loc4: neighborhoods with parent_2 = USLOC23651000
