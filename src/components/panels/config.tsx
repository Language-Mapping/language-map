import React from 'react'

import { icons } from 'components/config'
import { LocalPanel } from 'components/local'
import { Explore, LangCardsList, MidLevelExplore } from 'components/explore'
import { MapPanel } from 'components/panels/types'
import { LegendPanel } from 'components/legend'
import { DetailsPanel, NoFeatSel } from 'components/details'
import { InfoPanel } from 'components/about/InfoPanel'
import { NavItemWithBadge } from './NavItemWithBadge'

export const MOBILE_PANEL_HEADER_HT = 48 // .MuiToolbar-dense default min-height
export const panelWidths = { mid: 450, midLarge: 600 }

// Bottom bar nav panel
export const navRoutes: MapPanel[] = [
  {
    heading: 'Home',
    icon: icons.Home,
    component: <LegendPanel />,
    rootPath: '/',
    exact: true,
  },
  {
    heading: 'Explore',
    icon: icons.Explore,
    component: <Explore />,
    rootPath: '/Explore',
  },
  {
    heading: 'Data',
    icon: <NavItemWithBadge>{icons.Data}</NavItemWithBadge>,
    component: null,
    rootPath: '/table',
  },
  {
    heading: 'Census',
    icon: icons.Census,
    component: <LocalPanel />,
    rootPath: '/Census',
  },
  {
    heading: 'Info',
    icon: icons.Info,
    component: <InfoPanel />,
    rootPath: '/Info',
  },
]

export const nonNavRoutesConfig = [
  {
    component: <NoFeatSel />,
    rootPath: '/Explore/Language/none', // reserved
  },
  {
    component: <DetailsPanel />,
    rootPath: '/Explore/Language/:language/:id',
    exact: true,
  },
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
