import * as Types from './types'

const pumaSrcID: Types.BoundariesInternalSrcID = 'puma'

export const pumaLyrSrc = {
  source: pumaSrcID,
  'source-layer': 'NYC_PUMA2017_5yr_langHome-0tfhwp',
  minzoom: 8,
}

// The feature-state approach came from:
// https://docs.mapbox.com/help/tutorials/data-joins-with-mapbox-boundaries/
export const pumaConfig = {
  source: {
    id: pumaSrcID,
    url: 'mapbox://elalliance.5tfrskw8',
  },
  layers: [
    {
      id: 'puma-poly',
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
      ...pumaLyrSrc,
    },
    {
      id: 'puma-line',
      type: 'line',
      ...pumaLyrSrc,
      paint: {
        'line-color': '#c2c2c2',
        'line-opacity': 0.2,
      },
    },
  ],
} as Omit<Types.BoundaryConfig, 'lookupPath'>
