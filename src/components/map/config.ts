// TODO: rm if only using local, otherwise restore when ready
// const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'

import iconTree from './icons/tree.svg'
import iconBook from './icons/book.svg'
import iconUsers from './icons/users.svg'
import iconHome from './icons/home.svg'
import iconMuseum from './icons/museum.svg'

export const MAPBOX_TOKEN = process.env.REACT_APP_MB_TOKEN
export const mbStyleTileConfig = {
  // NOTE: Draft does NOT seem to be reliable or real-time
  // styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48/draft',
  // TODO: rm if only using local, otherwise restore when ready
  // styleUrl: 'elalliance/ckcmivm0r1o491iomlji26c48',
  // TODO: ^^^ consider local URL, at least during dev ^^^
  symbStyleUrl: '/data/mb-styles.langs.json',
  // layerId: 'languages-08ip3e',
  layerId: 'jason-schema-no-disp-5eaf8w',
  // tilesetId: 'elalliance.d0yv450e',
  tilesetId: 'elalliance.5okvgals',
  internalSrcID: 'languages-src', // arbitrary, set in code, never changes
  // So far this is the only known way to use the custom fonts
  customStyles: {
    dark: 'mapbox://styles/elalliance/ckdqj968x01ot19lf5yg472f2',
    light: 'mapbox://styles/elalliance/ckdovh9us01wz1ipa5fjihv7l',
  },
}

export const NYC_LAT_LONG = { latitude: 40.7128, longitude: -74.006 }

// TODO: rm if only using local, otherwise restore when ready
// export const symbStyleUrl = `${MB_STYLES_API_URL}/${mbStyleTileConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`
// Unsure why it needs the type here but not for feature coords..
const mapCenter = [-73.96, 40.7128] as [number, number]

// Ideally we'd just start from the bounds of the languages layer, because what
// happens is:
// 1) initial state used
// 2) zoom to extent of bounds to get all features into state
// 3) zoom to initialBounds
export const initialMapState = {
  latitude: mapCenter[1],
  longitude: mapCenter[0],
  zoom: 5,
}

// This is for #3 above. It should include the 5 boroughs and bits of NJ, and
// centered on Manhattan.
export const initialBounds = [
  [-74.19564, 40.574533],
  [-73.767185, 40.892251],
] as [[number, number], [number, number]]

export const langTypeIconsConfig = [
  { icon: iconTree, id: '_tree' },
  { icon: iconBook, id: '_book' },
  { icon: iconUsers, id: '_users' },
  { icon: iconHome, id: '_home' },
  { icon: iconMuseum, id: '_museum' },
]

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

// For icons? Fonts?
// https://github.com/mapbox/tiny-sdf

// Other color palette options
// https://github.com/Siddharth11/Colorful

// STYLE
// https://api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ
