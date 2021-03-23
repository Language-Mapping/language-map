import React from 'react'
import { TiThList } from 'react-icons/ti'
import { FaBinoculars, FaClipboard } from 'react-icons/fa'
import { GoFile } from 'react-icons/go'
import { BiHomeAlt } from 'react-icons/bi'

import { Home } from 'components/home'
import { LocalPanel } from 'components/local'
import { DetailsPanel } from 'components/details'
import { Explore, LangCardsList, MidLevelExplore } from 'components/explore'

import { LocalPanelProps } from 'components/map/types'
import { MapPanel } from 'components/panels/types'
import { NavItemWithBadge } from './NavItemWithBadge'

export const MOBILE_PANEL_HEADER_HT = '2rem'
export const panelWidths = { mid: 450, midLarge: 600 }

// Bottom bar nav panel
export const navRoutes: MapPanel[] = [
  {
    heading: 'Home',
    icon: <BiHomeAlt />,
    component: <Home />,
    rootPath: '/',
    exact: true,
  },
  {
    heading: 'Explore',
    icon: <FaBinoculars />,
    component: <Explore icon={<FaBinoculars />} />,
    rootPath: '/Explore',
  },
  {
    heading: 'Data',
    icon: (
      <NavItemWithBadge>
        <TiThList />
      </NavItemWithBadge>
    ),
    component: null,
    rootPath: '/table',
  },
  {
    heading: 'Census',
    icon: <FaClipboard />,
    component: null,
    // eslint-disable-next-line react/display-name
    renderComponent: (props: LocalPanelProps): React.ReactNode => (
      <LocalPanel {...props} />
    ),
    rootPath: '/Census',
  },
  {
    heading: 'Details',
    icon: <GoFile />,
    component: <DetailsPanel />,
    rootPath: '/details',
  },
]

export const nonNavRoutesConfig = [
  {
    component: <LangCardsList field="Language" />, // set field explicitly
    rootPath: '/Explore/Language/:language',
  },
  {
    component: <LangCardsList />,
    rootPath: '/Explore/:field/:value/:language',
  },
  {
    component: <MidLevelExplore tableName="Language" />,
    rootPath: '/Explore/:field/:value',
  },
  {
    component: <MidLevelExplore />,
    rootPath: '/Explore/:field',
  },
  ...navRoutes,
] as MapPanel[]
