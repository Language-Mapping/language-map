import React from 'react'
import { TiThList } from 'react-icons/ti'
import { FaBinoculars, FaSearchLocation } from 'react-icons/fa'
import { GoFile } from 'react-icons/go'
import { BiHomeAlt } from 'react-icons/bi'

import { Home } from 'components/home'
import { SpatialPanel } from 'components/spatial'
import { DetailsPanel } from 'components/details'
import { Explore, LangCardsList, MidLevelExplore } from 'components/explore'

import { MapPanel } from 'components/panels/types'
import { NavItemWithBadge } from './NavItemWithBadge'

export const MOBILE_PANEL_HEADER_HT = '3rem'
export const panelWidths = { mid: 450, midLarge: 600 }

const landingFields = ['name', 'languages']
const instanceFields = ['Endonym', 'name', 'Primary Locations']

// For the bottom bar nav panel
export const navRoutes = [
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
    heading: 'Spatial',
    icon: <FaSearchLocation />,
    component: null,
    // eslint-disable-next-line react/display-name
    renderComponent: (props) => <SpatialPanel {...props} />,
    rootPath: '/spatial',
  },
  {
    heading: 'Details',
    icon: <GoFile />,
    component: <DetailsPanel />,
    rootPath: '/details',
  },
] as MapPanel[]

export const panelsConfig = [
  {
    component: <LangCardsList />,
    rootPath: '/Explore/Language/:value',
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
    component: (
      <MidLevelExplore
        tableName="World Region"
        filterByFormula="{languages} != ''"
        fields={[...landingFields, 'icon-color']}
      />
    ),
    rootPath: '/Explore/World Region',
  },
  {
    component: (
      <MidLevelExplore
        tableName="Country"
        filterByFormula="{languages} != ''"
        fields={[...landingFields, 'src_image']}
      />
    ),
    rootPath: '/Explore/Country',
  },
  {
    component: <MidLevelExplore tableName="Language" fields={instanceFields} />,
    rootPath: '/Explore/Language',
  },
  {
    component: <MidLevelExplore filterByFormula="{languages} != ''" />,
    rootPath: '/Explore/:field',
  },
  ...navRoutes,
] as MapPanel[]
