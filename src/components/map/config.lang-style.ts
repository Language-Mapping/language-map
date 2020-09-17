import { LayerPropsNonBGlayer } from './types'

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

// TODO: all hex to HSL

const bySize = [
  {
    id: 'Smallest',
    group: 'Size',
    filter: ['match', ['get', 'Size'], [1], true, false],
    layout: { 'icon-size': 0.15 },
    paint: { 'icon-color': '#6baed6' },
  },
  {
    id: 'Small',
    group: 'Size',
    filter: ['match', ['get', 'Size'], [2], true, false],
    layout: { 'icon-size': 0.2 },
    paint: { 'icon-color': '#4292c6' },
  },
  {
    id: 'Medium',
    group: 'Size',
    filter: ['match', ['get', 'Size'], [3], true, false],
    layout: { 'icon-size': 0.25 },
    paint: { 'icon-color': '#2171b5' },
  },
  {
    id: 'Large',
    group: 'Size',
    filter: ['match', ['get', 'Size'], [4], true, false],
    layout: { 'icon-size': 0.3 },
    paint: { 'icon-color': '#08519c' },
  },
  {
    id: 'Largest',
    group: 'Size',
    filter: ['match', ['get', 'Size'], [5], true, false],
    layout: { 'icon-size': 0.35 },
    paint: { 'icon-color': '#08306b' },
  },
]

const byStatus = [
  {
    id: 'Historical',
    group: 'Status',
    filter: ['match', ['get', 'Status'], ['Historical'], true, false],
    layout: { 'icon-image': '_museum' },
    paint: {
      'icon-color': 'hsl(217, 40%, 50%)',
      'text-color': 'hsl(217, 40%, 40%)',
    },
  },
  {
    id: 'Community',
    group: 'Status',
    filter: ['match', ['get', 'Status'], ['Community'], true, false],
    layout: { 'icon-image': '_users' },
    paint: {
      'icon-color': 'hsl(22, 68%, 59%)',
      'text-color': 'hsl(22, 68%, 49%)',
    },
  },
  {
    id: 'Liturgical',
    group: 'Status',
    filter: ['match', ['get', 'Status'], ['Liturgical'], true, false],
    layout: { 'icon-image': '_book' },
    paint: {
      'icon-color': 'hsl(358, 50%, 54%)',
      'text-color': 'hsl(358, 50%, 44%)',
    },
  },
  {
    id: 'Residential',
    group: 'Status',
    filter: ['match', ['get', 'Status'], ['Residential'], true, false],
    layout: { 'icon-image': '_home' },
    paint: {
      'icon-color': 'hsl(254, 31%, 57%)',
      'text-color': 'hsl(254, 31%, 47%)',
    },
  },
  {
    id: 'Reviving',
    group: 'Status',
    filter: ['match', ['get', 'Status'], ['Reviving'], true, false],
    layout: { 'icon-image': '_tree' },
    paint: {
      'icon-color': 'hsl(133, 33%, 50%)',
      'text-color': 'hsl(133, 33%, 40%)',
    },
  },
]

export default [
  ...bySize,
  ...byStatus,
  {
    id: 'Polynesia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Polynesia'], true, false],
    paint: { 'icon-color': '#c49a8d', 'text-color': '#c49a8d' },
  },
  {
    id: 'Northern Europe',
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Northern Europe'],
      true,
      false,
    ],
    layout: {},
    paint: { 'icon-color': '#295e5b', 'text-color': '#295e5b' },
  },
  {
    id: 'Australia and New Zealand',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Australia and New Zealand'],
      true,
      false,
    ],
    paint: { 'icon-color': '#867078', 'text-color': '#867078' },
  },
  {
    id: 'Micronesia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Micronesia'], true, false],
    paint: { 'icon-color': '#72493b', 'text-color': '#72493b' },
  },
  {
    id: 'Melanesia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Melanesia'], true, false],
    paint: { 'icon-color': '#b68372', 'text-color': '#b68372' },
  },
  {
    id: 'Southern Africa',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Southern Africa'],
      true,
      false,
    ],
    paint: { 'icon-color': '#846caf', 'text-color': '#846caf' },
  },
  {
    id: 'Middle Africa',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Middle Africa'], true, false],
    paint: { 'icon-color': '#684984', 'text-color': '#684984' },
  },
  {
    id: 'Northern Africa',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Northern Africa'],
      true,
      false,
    ],
    paint: { 'icon-color': '#da84b7', 'text-color': '#da84b7' },
  },
  {
    id: 'Eastern Africa',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Eastern Africa'], true, false],
    paint: { 'icon-color': '#d64699', 'text-color': '#d64699' },
  },
  {
    id: 'Southern Asia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Southern Asia'], true, false],
    paint: { 'icon-color': '#dd3939', 'text-color': '#dd3939' },
  },
  {
    id: 'Eastern Asia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Eastern Asia'], true, false],
    paint: { 'icon-color': '#dc6d3a', 'text-color': '#dc6d3a' },
  },
  {
    id: 'Central Asia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Central Asia'], true, false],
    paint: { 'icon-color': '#c29e49', 'text-color': '#c29e49' },
  },
  {
    id: 'Southern Europe',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Southern Europe'],
      true,
      false,
    ],
    paint: {
      'icon-color': '#7ca298',
      'text-color': 'hsl(164, 17%, 52%)',
      'text-halo-color': 'hsla(164, 17%, 90%, 0.95)',
    },
  },
  {
    id: 'Western Africa',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Western Africa'], true, false],
    paint: { 'icon-color': '#9b4899', 'text-color': '#9b4899' },
  },
  {
    id: 'Western Europe',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Western Europe'], true, false],
    paint: { 'icon-color': '#397439', 'text-color': '#397439' },
  },
  {
    id: 'Western Asia',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Western Asia'], true, false],
    paint: { 'icon-color': '#97a853', 'text-color': '#97a853' },
  },
  {
    id: 'Southeastern Asia',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Southeastern Asia'],
      true,
      false,
    ],
    paint: { 'icon-color': '#96302e', 'text-color': '#96302e' },
  },
  {
    id: 'Eastern Europe',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Eastern Europe'], true, false],
    paint: {
      'icon-color': '#88c64c',
      'text-color': 'hsl(90, 52%, 48%)',
      'text-halo-color': 'hsla(90, 52%, 90%, 0.95)',
    },
  },
  {
    id: 'South America',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['South America'], true, false],
    paint: { 'icon-color': '#3fb4ce', 'text-color': '#3fb4ce' },
  },
  {
    id: 'Northern America',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Northern America'],
      true,
      false,
    ],
    paint: { 'icon-color': '#465192', 'text-color': '#465192' },
  },
  {
    id: 'Central America',
    layout: {},
    group: 'World Region',
    filter: [
      'match',
      ['get', 'World Region'],
      ['Central America'],
      true,
      false,
    ],
    paint: { 'icon-color': '#4e7bbc', 'text-color': '#4e7bbc' },
  },
  {
    id: 'Caribbean',
    layout: {},
    group: 'World Region',
    filter: ['match', ['get', 'World Region'], ['Caribbean'], true, false],
    paint: {
      'icon-color': 'hsl(169, 39%, 52%)',
      'text-color': 'hsl(169, 39%, 48%)',
      'text-halo-color': 'hsla(169, 39%, 90%, 0.95)',
    },
  },
] as LayerPropsNonBGlayer[]
