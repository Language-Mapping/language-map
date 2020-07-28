import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { FiLayers } from 'react-icons/fi'
import { TiDocumentText, TiThList } from 'react-icons/ti'

import { LayersPanel, DetailsPanel, ResultsPanel } from 'components/map'
import { MapPanelTypes } from './types'

export const panelsConfig = [
  {
    heading: 'Explore',
    subheading: 'Searching, filtering, etc.',
    icon: <FaSearch />,
    route: '/',
    component: (
      <p>
        This panel would be shown first since it is what we want the user to see
        before diving into anything else.
      </p>
    ),
  },
  {
    heading: 'Display',
    subheading: 'Symb + label ctrls. Alt. name?',
    icon: <FiLayers />,
    route: '/display',
    component: <LayersPanel />,
  },
  {
    heading: 'Data',
    subheading: 'Table or list of results',
    icon: <TiThList />,
    route: '/results',
    // Could this work instead of emoji API? Seems way too easy.
    // https://material-ui.com/components/autocomplete/#country-select
    component: <ResultsPanel />,
  },
  {
    heading: 'Details',
    subheading: '...of selected feature',
    icon: <TiDocumentText />,
    route: '/details',
    component: <DetailsPanel />,
  },
] as MapPanelTypes[]
