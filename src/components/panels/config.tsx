import React from 'react'
import { TiDocumentText, TiThList } from 'react-icons/ti'
import { FaBinoculars } from 'react-icons/fa'
import { BiHomeAlt } from 'react-icons/bi'

import { FiltersPanel } from 'components/filters'
import { DetailsPanel } from 'components/details'
import { Field, Explore, FieldValue } from 'components/sift'

import { MapPanel } from 'components/panels/types'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { NavItemWithBadge } from './NavItemWithBadge'

export const MOBILE_PANEL_HEADER_HT = '3rem'
export const panelWidths = { mid: 450, midLarge: 600 }

export const panelsConfig = [
  {
    heading: 'Home',
    subheading: 'is where the legend is',
    icon: <BiHomeAlt />,
    component: <FiltersPanel />,
    rootPath: '/',
    exact: true,
    omitDefaults: true,
  },
  {
    heading: 'Level 2 cat',
    subheading: 'and sift results',
    icon: <FaBinoculars />,
    component: <FieldValue />,
    rootPath: '/Explore/:field/:value',
  },
  {
    heading: 'Level 1 cat',
    subheading: 'and sift results',
    icon: <FaBinoculars />,
    component: <Field />,
    rootPath: '/Explore/:field',
  },
  {
    heading: 'Explore',
    subheading: 'and sift results',
    intro: 'Intro/summary of Explore goes here',
    icon: <FaBinoculars />,
    component: <Explore icon={<FaBinoculars />} />,
    rootPath: '/Explore',
  },
  {
    heading: 'Data',
    subheading: 'and data and and and filters',
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
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    component: <DetailsPanel />,
    rootPath: '/details',
  },
  {
    heading: 'Help',
    subheading: 'glossary etc.',
    icon: <AiOutlineQuestionCircle />,
    component: null, // TODO: consider into panel rather than modal
    rootPath: '/help',
  },
] as MapPanel[]
