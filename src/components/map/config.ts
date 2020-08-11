// TODO: rm if only using local, otherwise restore when ready
// const MB_STYLES_API_URL = 'https://api.mapbox.com/styles/v1'

import iconArrowUp from './icons/arrow-up.svg'
import iconBook from './icons/book.svg'
import iconBuilding from './icons/building.svg'
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
  layerId: 'languages-08ip3e',
  tilesetId: 'elalliance.d0yv450e',
  internalSrcID: 'languages-src', // arbitrary, set in code, never changes
}

// TODO: rm if only using local, otherwise restore when ready
// export const symbStyleUrl = `${MB_STYLES_API_URL}/${mbStyleTileConfig.styleUrl}?access_token=${MAPBOX_TOKEN}`
// Unsure why it needs the type here but not for feature coords..
const mapCenter = [-73.96, 40.7128] as [number, number]

export const initialMapState = {
  latitude: mapCenter[1],
  longitude: mapCenter[0],
  zoom: 5,
}

// After the `fitBounds` happens and gets all the features into state
export const postLoadMapView = {
  desktop: {
    lat: 40.7186,
    lng: -73.9079,
    zoom: 10.76,
  },
  mobile: {
    lat: 40.7293,
    lng: -73.9059,
    zoom: 9.39,
  },
}

export const langTypeIconsConfig = [
  { icon: iconArrowUp, id: 'arrow-up' },
  { icon: iconBook, id: 'book' },
  { icon: iconBuilding, id: 'building' },
  { icon: iconHome, id: 'home' },
  { icon: iconMuseum, id: 'museum' },
]

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

// For icons? Fonts?
// https://github.com/mapbox/tiny-sdf

// Other color palette options
// https://github.com/Siddharth11/Colorful

// STYLE
// https://api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ
