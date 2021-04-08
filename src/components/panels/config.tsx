import React from 'react'

import { icons } from 'components/config'
import { LocalPanel } from 'components/local'
import {
  Explore,
  LangCardsList,
  MidLevelExplore,
  ExploreLanding,
  NeighborhoodsLanding,
  NeighborhoodsInstance,
  CountiesLanding,
} from 'components/explore'
import { MapPanel } from 'components/panels/types'
import { LegendPanel } from 'components/legend'
import { DetailsPanel, NoFeatSel } from 'components/details'
import { InfoPanel } from 'components/about/InfoPanel'
import { routes } from 'components/config/api'
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
  { component: <NoFeatSel />, rootPath: routes.none },
  { component: <DetailsPanel />, rootPath: routes.details, exact: true },
  {
    component: <LangCardsList field="Language" />, // set field explicitly
    rootPath: routes.languageInstance,
  },
  {
    component: <NeighborhoodsLanding />,
    rootPath: '/Explore/Neighborhood',
    exact: true,
  },
  {
    component: <CountiesLanding />,
    rootPath: routes.countiesBase,
    exact: true,
  },
  {
    component: <NeighborhoodsInstance />,
    rootPath: '/Explore/Neighborhood/:value',
    exact: true,
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
    component: <ExploreLanding />,
    rootPath: '/Explore/:field',
  },
  ...navRoutes,
] as MapPanel[]
