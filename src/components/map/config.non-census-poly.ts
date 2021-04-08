const sharedLinePaint = { 'line-opacity': 0.4 }
const sharedFillOpacity = [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  0.29,
  0.14,
]

export const nonCensusPolygonConfig = {
  neighborhoods: {
    linePaint: { ...sharedLinePaint, 'line-color': '#FFA500' },
    routePath: '/Explore/Neighborhood/:id',
    selLineColor: 'rgb(255, 165, 0)',
    selFillColor: 'rgb(255, 165, 0)',
    sourceID: 'neighborhoods',
    sourceLayer: 'neighborhoods',
    tableName: 'Neighborhood',
    url: 'mapbox://elalliance.ckmundquc1k5328ppob5a9wok-1kglp',
    visContextKey: 'showNeighbs',
    uniqueIDfield: 'name',
    fillPaint: {
      'fill-color': 'orange',
      'fill-opacity': sharedFillOpacity,
    },
  },
  counties: {
    linePaint: {
      ...sharedLinePaint,
      'line-color': 'hsl(209, 42%, 73%)',
    },
    routePath: '/Explore/County/:id',
    selLineColor: 'hsl(193, 73%, 52%)',
    selFillColor: 'hsla(193, 63%, 42%, 0.85)',
    sourceID: 'counties',
    sourceLayer: 'counties',
    tableName: 'County',
    url: 'mapbox://elalliance.ckmyz29pm0zzq22nax87m0kxb-7j7uy',
    visContextKey: 'showCounties',
    uniqueIDfield: 'name',
    fillPaint: {
      'fill-color': 'hsl(193, 63%, 32%)',
      'fill-opacity': sharedFillOpacity,
    },
  },
}
