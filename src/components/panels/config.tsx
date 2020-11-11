import React from 'react'
import { TiThList } from 'react-icons/ti'
import { FaBinoculars } from 'react-icons/fa'
import { GoFile } from 'react-icons/go'
import { BiHomeAlt } from 'react-icons/bi'

import { Home } from 'components/home'
import { DetailsPanel } from 'components/details'
import { Explore, LangCardsList, MidLevelExplore } from 'components/explore'

import { MapPanel } from 'components/panels/types'
import { NavItemWithBadge } from './NavItemWithBadge'

export const MOBILE_PANEL_HEADER_HT = '3rem'
export const panelWidths = { mid: 450, midLarge: 600 }

export const panelsConfig = [
  {
    heading: 'Home',
    icon: <BiHomeAlt />,
    component: <Home />,
    rootPath: '/',
    exact: true,
  },
  {
    heading: 'Language dead-end',
    component: <LangCardsList />,
    rootPath: '/Explore/Language/:value',
  },
  {
    heading: 'Pre-details, nested w/extra params',
    component: <LangCardsList />,
    rootPath: '/Explore/:field/:value/:language',
  },
  {
    heading: 'Level 2 cat',
    component: <MidLevelExplore />,
    rootPath: '/Explore/:field/:value',
  },
  {
    heading: 'Level 1 cat',
    component: <MidLevelExplore />,
    rootPath: '/Explore/:field',
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
    heading: 'Details',
    icon: <GoFile />,
    component: <DetailsPanel />,
    rootPath: '/details',
  },
] as MapPanel[]
