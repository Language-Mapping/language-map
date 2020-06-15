// For more information on data-driven styles, see
// https://www.mapbox.com/help/gl-dds-ref/
export const polygonStyle = {
  id: 'polygons',
  type: 'fill',
  paint: {
    'fill-color': 'gray',
    'fill-outline-color': '#eee',
    'fill-opacity': 0.6,
  },
}

export const pointStyle = {
  id: 'points',
  type: 'circle',
  paint: {
    'circle-radius': 6,
    'circle-color': '#007cbf',
  },
}
