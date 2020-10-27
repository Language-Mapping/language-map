import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Fab } from '@material-ui/core'
import { TiDocumentText, TiThList } from 'react-icons/ti'
import { ImSearch } from 'react-icons/im'
import { BiHomeAlt } from 'react-icons/bi'

import { FiltersPanel } from 'components/filters'
import { DetailsPanel } from 'components/details'
import { Sift } from 'components/sift'
import { MapPanel } from 'components/panels/types'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { NavItemWithBadge } from './NavItemWithBadge'

export const MOBILE_PANEL_HEADER_HT = '3rem'
export const panelWidths = { mid: 450, midLarge: 600 }

export const panelsConfig = [
  {
    heading: 'Data', // TODO: show "& filters" on desk
    subheading: 'and data and and and filters',
    icon: (
      <NavItemWithBadge>
        <TiThList />
      </NavItemWithBadge>
    ),
    component: null,
    rootPath: '/table',
    locStateKey: 'tableStuff',
  },
  {
    heading: 'Explore',
    subheading: 'and sift results',
    icon: <ImSearch />,
    component: <Sift />,
    rootPath: '/grid',
    locStateKey: 'focusField',
  },
  {
    heading: '',
    subheading: 'is where the legend is',
    icon: (
      <Fab
        color="secondary"
        aria-label="home"
        style={{ position: 'relative', top: -4 }}
        component={RouterLink}
        to="/"
      >
        <BiHomeAlt />
      </Fab>
    ),
    component: <FiltersPanel />,
    rootPath: '/',
    locStateKey: null,
    exact: true,
  },
  {
    heading: 'Details',
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    component: <DetailsPanel />,
    rootPath: '/details',
    locStateKey: 'selFeatID',
  },
  {
    heading: 'Help',
    subheading: 'glossary etc.',
    icon: <AiOutlineQuestionCircle />,
    component: null, // TODO: consider into panel rather than modal
    rootPath: '/help',
    locStateKey: null,
  },
] as MapPanel[]
