import { SymbolLayout } from 'mapbox-gl'
import { LangTypeIconsConfig } from '../legend/types'

// `Status` icons
import iconBook from './icons/book.svg'
import iconCircle from './icons/circle.svg'
import iconHome from './icons/home.svg'
import iconMuseum from './icons/museum.svg'
import iconTree from './icons/tree.svg'
import iconUsers from './icons/users.svg'

// FRAGILE in the sense that the "id" is in Airtable
export const langTypeIconsConfig = [
  { icon: iconTree, id: '_tree' },
  { icon: iconBook, id: '_book' },
  { icon: iconUsers, id: '_users' },
  { icon: iconHome, id: '_home' },
  { icon: iconMuseum, id: '_museum' },
  { icon: iconCircle, id: '_circle' },
] as LangTypeIconsConfig[]

const iconDefaults = {
  'icon-image': '_circle',
  'icon-size': [
    'step',
    ['zoom'],
    0.14,
    10,
    0.17,
    11,
    0.19,
    13,
    0.21,
    15,
    0.23,
    17,
    0.26,
  ],
  'icon-ignore-placement': true,
}

// Just a bit bigger than the circle icons
export const iconStyleOverride = {
  'icon-size': [
    'step',
    ['zoom'],
    0.25,
    10,
    0.28,
    11,
    0.3,
    12,
    0.32,
    14,
    0.35,
    17,
    0.4,
  ],
  'icon-ignore-placement': false,
} as SymbolLayout

const textLayoutDefaults = {
  // TODO: look into text max width, or whatever the one is that's in `em`s
  'text-field': ['to-string', ['get', 'Language']],
  'text-font': ['Noto Sans Regular', 'Arial Unicode MS Regular'],
  'text-radial-offset': 0.25,
  'text-justify': 'auto',
  'text-size': ['step', ['zoom'], 8, 10, 9, 11, 10, 14, 11],
  'text-variable-anchor': [
    'bottom-left',
    'top-left',
    'bottom-right',
    'top-right',
    'bottom',
    'top',
    'left',
    'right',
    'center',
  ],
}

export const mapLabelDefaults = {
  layout: {
    ...textLayoutDefaults,
    ...iconDefaults,
  },
  paint: {
    'text-color': 'hsl(0, 0%, 5%)',
    'text-halo-width': 1,
    'text-halo-color': 'hsla(0, 0%, 95%, 0.95)',
  },
}

// TODO: consider orig. Region colors for `Status`: https://bit.ly/34szqZe
// TODO: all hex to HSL in Airtables: World Region, Size, Status

// TODO: don't have a million filters and a million layers if you only need one
// per symbolizeable column:
//
// const example = {
//   'icon-color': [
//     'match',
//     ['get', 'STORE_TYPE'], // Use the result 'STORE_TYPE' property
//     'Convenience Store',
//     '#FF8C00',
//     'Specialty Food Store',
//     '#9ACD32',
//     'Small Grocery Store',
//     '#008000',
//     'Warehouse Club Store',
//     '#008000',
//     '#FF0000', // any other store type
//   ],
// }

// For icons? Fonts? https://github.com/mapbox/tiny-sdf
// Other color palette options: // https://github.com/Siddharth11/Colorful

// STYLE
// api.mapbox.com/styles/v1/elalliance/ckcmivm0r1o491iomlji26c48?access_token=TOKEN

// Looks handy?
// https://api.mapbox.com/v4/elalliance.d0yv450e.json?secure&access_token=TOKEN
