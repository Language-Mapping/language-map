import React from 'react'
import { TiDocumentText } from 'react-icons/ti'
import { ImSearch } from 'react-icons/im'

import { FiltersPanel } from 'components/filters'
import { DetailsPanel } from 'components/details'
import { MapPanel } from 'components/map/types'

export const panelsConfig = [
  {
    heading: 'Details',
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    component: <DetailsPanel />,
    path: '/details',
  },
  {
    heading: 'Explore',
    subheading: 'and query language data',
    icon: <ImSearch />,
    component: <FiltersPanel />,
    path: '/',
  },
] as MapPanel[]
