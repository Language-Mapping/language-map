import * as MapTypes from './types'

// `Status` icons
import iconTree from './icons/tree.svg'
import iconBook from './icons/book.svg'
import iconUsers from './icons/users.svg'
import iconHome from './icons/home.svg'
import iconMuseum from './icons/museum.svg'

// Unsure why it needs the type here but not for feature coords..
const mapCenter = [-73.96, 40.7128] as [number, number]

export const NYC_LAT_LONG = { latitude: 40.7128, longitude: -74.006 }
export const MAPBOX_TOKEN = process.env.REACT_APP_MB_TOKEN
export const mbStyleTileConfig = {
  symbStyleUrl: '/data/mb-styles.langs.json',
  layerId: 'jason-schema-no-disp-5eaf8w', // TODO: a dev/deploy-only instance!
  tilesetId: 'elalliance.5okvgals',
  langSrcID: 'languages-src', // arbitrary, set in code, never changes
  // So far this is the only known way to use the custom fonts
  customStyles: {
    dark: 'mapbox://styles/elalliance/ckdqj968x01ot19lf5yg472f2',
    light: 'mapbox://styles/elalliance/ckdovh9us01wz1ipa5fjihv7l',
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
  zoom: 5,
}

export const mapProps = {
  attributionControl: false,
  className: 'mb-language-map',
  clickRadius: 4, // much comfier for small points on small screens
  height: '100%',
  mapboxApiAccessToken: MAPBOX_TOKEN,
  mapOptions: { logoPosition: 'bottom-left' },
  mapStyle: mbStyleTileConfig.customStyles.light,
  width: '100%',
}

// This is for #3 above. It should include the 5 boroughs and bits of NJ, and
// centered on Manhattan.
export const initialBounds = [
  [-74.19564, 40.574533],
  [-73.767185, 40.892251],
] as MapTypes.BoundsArray

export const langTypeIconsConfig = [
  { icon: iconTree, id: '_tree' },
  { icon: iconBook, id: '_book' },
  { icon: iconUsers, id: '_users' },
  { icon: iconHome, id: '_home' },
  { icon: iconMuseum, id: '_museum' },
]

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

const neighbSrcID = 'neighborhoods'
const neighbLyrSrc = {
  source: neighbSrcID,
  'source-layer': 'boundaries_locality_4',
  minzoom: 9,
}

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
} as MapTypes.BoundaryConfig

const countiesSrcID = 'counties'
const countiesLyrSrc = {
  source: countiesSrcID,
  'source-layer': 'boundaries_admin_2',
  minzoom: 7,
}

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
} as MapTypes.BoundaryConfig

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

// For icons? Fonts?
// https://github.com/mapbox/tiny-sdf

// Other color palette options
// https://github.com/Siddharth11/Colorful

// STYLE
// https://api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ
