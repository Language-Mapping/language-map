import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
    subheading: 'and query language data',
    icon: <FaFilter />,
    route: '/',
    summary: (
      <>
        Explore 1000+ language communities using the options below. Your filters
        affect both the map and{' '}
        <RouterLink to={`/results${window.location.search}`}>
          data table
        </RouterLink>
        .
      </>
    ),
    component: <FiltersPanel />,
  },
  {
    heading: 'Data',
    subheading: 'as a searchable table',
    icon: <TiThList />,
    route: '/results',
    // Could this work instead of emoji API? Seems way too easy.
    // https://material-ui.com/components/autocomplete/#country-select
    component: <ResultsPanel />,
    summary: (
      <>
        View results of your{' '}
        <RouterLink to={`/${window.location.search}`}>filters</RouterLink> in a
        table which you can further refine, sort, and search. Note that options
        here only affect the table below.
      </>
    ),
  },
  {
    heading: 'Details',
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    route: '/details',
    component: <DetailsPanel />,
    summary: '',
  },
  {
    heading: 'Settings',
    subheading: 'for map symbols and labels',
    icon: <GoSettings />,
    route: '/display',
    component: <LayersPanel />,
    summary:
      'Visualize language communities in different ways by changing their symbols and labels below.',
  },
] as MapPanelTypes[]
