import * as Types from './types'

const censusSrcID: Types.BoundariesInternalSrcID = 'tracts'

export const censusLyrSrc = {
  source: censusSrcID,
  'source-layer': 'boundaries_stats_4',
  minzoom: 8,
}

// The feature-state approach came from:
// https://docs.mapbox.com/help/tutorials/data-joins-with-mapbox-boundaries/
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
        'fill-color': [
          'case',
          ['!=', ['feature-state', 'total'], NaN],
          [
            'interpolate',
            ['linear'],
            ['feature-state', 'total'],
            4,
            'rgb(237, 248, 233)', // 'rgba(222,235,247,1)',
            140,
            'rgb(0, 109, 44)', // 'rgba(49,130,189,1)',
          ],
          'rgba(255, 255, 255, 0)',
        ],
        'fill-opacity': 0.8,
      },
      ...censusLyrSrc,
    },
    {
      id: 'census-line',
      type: 'line',
      ...censusLyrSrc,
      paint: {
        'line-color': '#c2c2c2',
        'line-opacity': 0.2,
      },
    },
  ],
} as Types.BoundaryConfig
