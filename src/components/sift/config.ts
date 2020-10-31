import * as Types from './types'

// Top-level column-based categories for Explore panel
export const categories = [
  {
    name: 'Language',
    definition: 'The basis of all life',
  },
  {
    name: 'World Region',
    definition: 'UN GeoScheme',
  },
  {
    name: 'Countries',
    definition: 'Parsed by commas',
    parse: true,
  },
  {
    name: 'Language Family',
    definition: 'Family reunion',
  },
  {
    name: 'Neighborhoods',
    definition: 'Only NYC',
    parse: true,
  },
  {
    name: 'Status',
    definition: 'See Help',
  },
] as Types.CategoryConfig[]
