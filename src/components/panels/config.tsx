import React from 'react'
import { TiDocumentText } from 'react-icons/ti'
import { ImSearch } from 'react-icons/im'

import { FiltersPanel } from 'components/filters'
import { DetailsPanel } from 'components/details'
import { MapPanel } from 'components/panels/types'

export const MOBILE_PANEL_HEADER_HEIGHT = '3rem'
export const panelWidths = { mid: 450, midLarge: 600 }

export const panelsConfig = [
  {
    heading: 'Explore',
    subheading: 'and query language data',
    icon: <ImSearch />,
    component: <FiltersPanel />,
    path: '/',
  },
  {
    heading: 'Details',
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    component: <DetailsPanel />,
    path: '/details',
  },
] as MapPanel[]
