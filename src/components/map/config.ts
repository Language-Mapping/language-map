import * as Types from './types'

export * from './config.census'
export * from './config.points'
export * from './config.polygons'

export const NYC_LAT_LONG = { latitude: 40.7128, longitude: -74.006 }
export const MAPBOX_TOKEN = process.env.REACT_APP_MB_TOKEN
export const initialMapState = { ...NYC_LAT_LONG, zoom: 8.5 }
export const POINT_ZOOM_LEVEL = 14.5 // clicked point or single-result filter
export const mbStyleTileConfig = {
  // layerId: 'Data-For_Map-2jwj5r', // TODO: a dev/deploy-only instance!
  // layerId: 'language-points', // TODO: a dev/deploy-only instance!
  layerId: 'mb-data', // TODO: a dev/deploy-only instance!
  langSrcID: 'languages-src', // arbitrary, set in code, never changes
  // tilesetId: 'elalliance.bvewtroy',
  // tilesetId: 'elalliance.ckja99koi2iq623pep38azez5-84txo',
  tilesetId: 'elalliance.ckja99koi2iq623pep38azez5-1ea9g',
  // This is the only known way to use the custom fonts
  customStyles: {
    dark: 'mapbox://styles/elalliance/ckdqj968x01ot19lf5yg472f2',
    light: 'mapbox://styles/elalliance/ckdovh9us01wz1ipa5fjihv7l',
    blank: 'mapbox://styles/elalliance/cki50pk2s00ux19phcg6k2tjc',
  },
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
