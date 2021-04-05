const selectedState = ['boolean', ['feature-state', 'selected'], false]
const sharedLinePaint = {
  'line-opacity': ['case', selectedState, 0.8, 0.4],
  'line-width': ['case', selectedState, 2, 1],
}

export const nonCensusPolygonConfig = {
  neighborhoods: {
    linePaint: { ...sharedLinePaint, 'line-color': '#FFA500' },
    routePath: '/Explore/Neighborhood/:id',
    sourceID: 'neighborhoods',
    sourceLayer: 'neighborhoods',
    tableName: 'Neighborhood',
    url: 'mapbox://elalliance.ckmundquc1k5328ppob5a9wok-1kglp',
    visContextKey: 'showNeighbs',
    fillPaint: {
      'fill-color': 'orange',
      'fill-opacity': [
        'case',
        selectedState,
        0.44,
        ['boolean', ['feature-state', 'hover'], false],
        0.29,
        0.14,
      ],
    },
  },
  counties: {
    linePaint: {
      ...sharedLinePaint,
      'line-color': [
        'case',
        selectedState,
        'hsl(209, 52%, 58%)',
        'hsl(209, 42%, 73%)',
      ],
    },
    routePath: '/Explore/County/:id',
    sourceID: 'counties',
    sourceLayer: 'counties',
    tableName: 'County',
    url: 'mapbox://elalliance.ckmyz29pm0zzq22nax87m0kxb-7j7uy',
    visContextKey: 'showCounties',
    fillPaint: {
      'fill-color': 'hsl(193, 63%, 32%)',
      'fill-opacity': [
        'case',
        selectedState,
        0.44,
        ['boolean', ['feature-state', 'hover'], false],
        0.29,
        0.14,
      ],
    },
  },
}
