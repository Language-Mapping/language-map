import { InitialMapProps, BoundsArray } from './types'

export * from './config.census'
export * from './config.points'
export * from './config.polygons'

export const MAPBOX_TOKEN = process.env.REACT_APP_MB_TOKEN
export const NYC_LAT_LONG = { latitude: 40.7128, longitude: -74.006 }
export const initialMapState = { ...NYC_LAT_LONG, zoom: 8.5 }
export const POINT_ZOOM_LEVEL = 14.5 // clicked point or single-result filter

const isLocalDev = window?.location.hostname === 'lampel-2.local'

export const mbStyleTileConfig = {
  layerId: 'mb-data', // TODO: a dev/deploy-only instance!
  langSrcID: 'languages-src', // arbitrary, set in code, never changes
  tilesetId: 'elalliance.ckja99koi2iq623pep38azez5-1ea9g',
  // Custom MB Style: the only known way to use the custom fonts
  customStyles: {
    dark: 'mapbox://styles/elalliance/ckdqj968x01ot19lf5yg472f2',
    light: 'mapbox://styles/elalliance/ckdovh9us01wz1ipa5fjihv7l',
    blank: 'mapbox://styles/elalliance/cki50pk2s00ux19phcg6k2tjc',
  },
}

const { light, blank } = mbStyleTileConfig.customStyles

export const mapProps: InitialMapProps = {
  attributionControl: false,
  className: 'mb-language-map',
  clickRadius: 4, // much comfier for small points on small screens
  height: '100%',
  mapboxApiAccessToken: MAPBOX_TOKEN,
  mapOptions: { logoPosition: 'bottom-left' },
  mapStyle: isLocalDev ? blank : light, // TODO: default to blank in dev
  maxZoom: 18, // 18 is kinda misleading w/the dispersed points, but looks good
  width: '100%',
}

// This is for #3 above. It should include the 5 boroughs and bits of NJ, and
// centered on Manhattan. // TODO: improve this now that no more offsets
export const initialBounds = [
  [-74.1, 40.58],
  [-73.767185, 40.89],
] as BoundsArray
