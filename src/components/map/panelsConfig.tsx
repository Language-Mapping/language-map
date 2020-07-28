import React from 'react'
import { FaFilter } from 'react-icons/fa'
import { GoSettings } from 'react-icons/go'
import { TiDocumentText, TiThList } from 'react-icons/ti'

import { LayersPanel, DetailsPanel, ResultsPanel } from 'components/map'
import { MapPanelTypes } from './types'

export const panelsConfig = [
  {
    heading: 'Filter',
    subheading: 'and query the data',
    icon: <FaFilter />,
    route: '/',
    component: (
      <p>
        This panel would be shown first since it is what we want the user to see
        before diving into anything else.
      </p>
    ),
  },
  {
    heading: 'Data',
    subheading: 'table of results',
    icon: <TiThList />,
    route: '/results',
    // Could this work instead of emoji API? Seems way too easy.
    // https://material-ui.com/components/autocomplete/#country-select
    component: <ResultsPanel />,
  },
  {
    heading: 'Details',
    subheading: 'of selected feature',
    icon: <TiDocumentText />,
    route: '/details',
    component: <DetailsPanel />,
  },
  {
    heading: 'Settings',
    subheading: 'for symbols and labels',
    icon: <GoSettings />,
    route: '/display',
    component: <LayersPanel />,
  },
] as MapPanelTypes[]
