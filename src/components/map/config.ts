import * as Types from './types'

// Unsure why it needs the type here but not for feature coords..
const mapCenter = [-73.96, 40.7128] as [number, number]

export * from './config.census'
export * from './config.points'
export * from './config.polygons'

export const MAPBOX_TOKEN = process.env.REACT_APP_MB_TOKEN
export const POINT_ZOOM_LEVEL = 14 // e.g. clicked point or single-result filter
export const NYC_LAT_LONG = { latitude: 40.7128, longitude: -74.006 }
export const mbStyleTileConfig = {
  symbStyleUrl: '/data/mb-styles.langs.json',
  layerId: 'jason-schema-no-disp-5eaf8w', // TODO: a dev/deploy-only instance!
  tilesetId: 'elalliance.5okvgals',
  langSrcID: 'languages-src', // arbitrary, set in code, never changes
  // So far this is the only known way to use the custom fonts
  customStyles: {
    dark: 'mapbox://styles/elalliance/ckdqj968x01ot19lf5yg472f2',
    light: 'mapbox://styles/elalliance/ckdovh9us01wz1ipa5fjihv7l',
    blank: 'mapbox://styles/elalliance/cki50pk2s00ux19phcg6k2tjc',
  },
}

// Ideally we'd just start from the bounds of the languages layer, because what
// happens is:
// 1) initial state used
// 2) zoom to extent of bounds to get all features into state
// 3) zoom to initialBounds
//
// https://docs.mapbox.com/api/maps/#example-response-retrieve-tilejson-metadata
// ^^^ can get the bounds first this way
export const initialMapState = {
  latitude: mapCenter[1],
  longitude: mapCenter[0],
  zoom: 4, // if set to 5, Firefox only sees ~70% of the features
}

export const mapProps: Types.InitialMapProps = {
  attributionControl: false,
  className: 'mb-language-map',
  clickRadius: 4, // much comfier for small points on small screens
  height: '100%',
  mapboxApiAccessToken: MAPBOX_TOKEN,
  mapOptions: { logoPosition: 'bottom-left' },
  mapStyle: mbStyleTileConfig.customStyles.light,
  maxZoom: 18, // 18 is kinda misleading w/the dispersed points, but looks good
  width: '100%',
}

// This is for #3 above. It should include the 5 boroughs and bits of NJ, and
// centered on Manhattan. // TODO: improve this now that no more offsets
export const initialBounds = [
  [-74.1, 40.58],
  [-73.767185, 40.89],
] as Types.BoundsArray
