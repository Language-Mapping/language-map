import { CirclePaint } from 'mapbox-gl'

// `Status` icons
import iconBook from './icons/book.svg'
import iconCircle from './icons/circle.svg'
import iconHome from './icons/home.svg'
import iconMuseum from './icons/museum.svg'
import iconTree from './icons/tree.svg'
import iconUsers from './icons/users.svg'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const SHEET_ID = '1QfySFNpD2VnLand3-lTNAPAlrm0Cmv9As01LAXgXC0E'
const SHEET_NAME = 'Mapbox_Fonts'
const SHEETS_API_ROOT = 'https://sheets.googleapis.com/v4/spreadsheets'

export const QUERY_ID = 'sheets-mb-fonts' // unique react-query ID
export const MB_FONTS_URL = `${SHEETS_API_ROOT}/${SHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_API_KEY}`

export const langTypeIconsConfig = [
  { icon: iconTree, id: '_tree' },
  { icon: iconBook, id: '_book' },
  { icon: iconUsers, id: '_users' },
  { icon: iconHome, id: '_home' },
  { icon: iconMuseum, id: '_museum' },
  { icon: iconCircle, id: '_circle' },
]

// TODO: rm once soln is found for indicating selected feature if type = symbol
export const commonCirclePaint = {
  'circle-stroke-color': 'cyan',
  'circle-stroke-width': [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    3,
    0,
  ],
} as CirclePaint

export const langLabelsStyle = {
  layout: {
    'text-variable-anchor': ['bottom-left', 'top-left'],
    'text-radial-offset': 0,
    'text-field': ['to-string', ['get', 'Language']],
    'text-font': ['Noto Sans Regular', 'Arial Unicode MS Regular'],
    'text-size': 10,
  },
  paint: {
    'text-color': 'hsl(0, 0%, 5%)',
    'text-halo-width': 1,
    'text-halo-color': 'hsla(0, 0%, 95%, 0.95)',
  },
}

// For icons? Fonts? https://github.com/mapbox/tiny-sdf
// Other color palette options: // https://github.com/Siddharth11/Colorful

// STYLE
// https://api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=pk.eyJ1IjoiZWxhbGxpYW5jZSIsImEiOiJja2M1Nmd6YnYwZXQ4MnJvYjd6MnJsb25lIn0.AC_4h4BmJCg2YvlygXzLxQ
