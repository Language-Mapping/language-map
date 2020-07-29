import React from 'react'
import { FaFilter } from 'react-icons/fa'
import { GoSettings } from 'react-icons/go'
import { TiDocumentText, TiThList } from 'react-icons/ti'

import {
  LayersPanel,
  DetailsPanel,
  ResultsPanel,
  FiltersPanel,
} from 'components/map'
import { MapPanelTypes } from './types'

export const panelsConfig = [
  {
    heading: 'Filter',
    subheading: 'narrow search',
    icon: <FaFilter />,
    route: '/',
    summary:
      'Explore 1000+ communities by name in English, in the language itself (endonym), and by ISO 639-3 and Glottocode. Find languages and dialects by region, country of origin, NYC-area location, and language family.',
    component: <FiltersPanel />,
  },
  {
    heading: 'Data',
    subheading: 'sift results',
    icon: <TiThList />,
    route: '/results',
    // Could this work instead of emoji API? Seems way too easy.
    // https://material-ui.com/components/autocomplete/#country-select
    component: <ResultsPanel />,
    summary:
      'View filtered results and refine further to discover communities by interacting directly with the data.',
  },
  {
    heading: 'Details',
    subheading: 'visit communities',
    icon: <TiDocumentText />,
    route: '/details',
    component: <DetailsPanel />,
    summary: '',
  },
  {
    heading: 'Settings',
    subheading: 'change interface',
    icon: <GoSettings />,
    route: '/display',
    component: <LayersPanel />,
    summary:
      'Adjust the symbols and labels on the map to see communities in different ways — as dots, as language names (in English or in the language itself), or as icons (depending on the type of community) — while displaying the size and region of origin.',
  },
] as MapPanelTypes[]
