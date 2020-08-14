/* eslint-disable react/display-name */
import React from 'react'
import { FaFilter } from 'react-icons/fa'
import { GoSettings } from 'react-icons/go'
import { TiDocumentText, TiThList } from 'react-icons/ti'

import { ResultsPanel } from 'components/results'
import { FiltersPanel } from 'components/filters'
import { LegendPanel } from 'components/legend'
import { DetailsPanel } from 'components/details'
import { MapPanel } from 'components/map/types'
import { LinkToActivePanel } from '../components/LinkToActivePanel'
// ^^^^^^ WOW: not using the same import syntax makes tons of errors DISAPPEAR

// CRED for Object.assign: https://stackoverflow.com/a/43376213/1048518
export const panelsConfig = [
  {
    heading: 'Filter',
    subheading: 'and query language data',
    active: true,
    icon: <FaFilter />,
    summary: (
      <>
        Explore 1000+ language communities using the options below. Your filters
        affect both the map and{' '}
        <LinkToActivePanel text="data table" activePanelIndex={1} />.
      </>
    ),
    component: <FiltersPanel />,
  },
  {
    heading: 'Data',
    subheading: 'as a searchable table',
    icon: <TiThList />,
    summary: (
      <>
        View results of your{' '}
        <LinkToActivePanel text="filters" activePanelIndex={0} /> in a table
        which you can further refine, sort, and search. Note that options here
        only affect the table below.
      </>
    ),
    component: <ResultsPanel />,
  },
  {
    heading: 'Details',
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    component: <DetailsPanel />,
    summary: null,
  },
  {
    heading: 'Settings',
    subheading: 'for map symbols and labels',
    icon: <GoSettings />,
    component: <LegendPanel />,
    summary:
      'Visualize language communities in different ways by changing their symbols and labels below.',
  },
] as Omit<MapPanel, 'active'>[]
/* eslint-enable react/display-name */
