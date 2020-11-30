import * as Types from './types'

const tractsSrcId: Types.BoundariesInternalSrcID = 'tracts'

export const tractsLyrSrc = {
  source: tractsSrcId,
  'source-layer': 'NYC_tract2013_17_langHome-8cd347',
  minzoom: 8,
}

// TODO: reuse this w/PUMA as they are nearly identical. As a function perhaps?
export const tractsConfig = {
  source: {
    id: tractsSrcId,
    url: 'mapbox://elalliance.5dh31p39',
  },
  layers: [
    {
      id: 'tracts-poly',
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
      ...tractsLyrSrc,
    },
    {
      id: 'tracts-line',
      type: 'line',
      ...tractsLyrSrc,
      paint: {
        'line-color': '#c2c2c2',
        'line-opacity': 0.2,
      },
    },
  ],
} as Omit<Types.BoundaryConfig, 'lookupPath'>
