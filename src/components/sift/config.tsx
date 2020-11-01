import React from 'react'
import { BiUserVoice, BiGlobe, BiMapPin } from 'react-icons/bi'
import { GoGlobe } from 'react-icons/go'
import { GiFamilyTree } from 'react-icons/gi'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'

import * as Types from './types'

// Top-level column-based categories for Explore panel
export const categories = [
  {
    name: 'Language',
    definition: 'The basis of all life',
    icon: <BiUserVoice />,
  },
  {
    name: 'World Region',
    definition: 'UN GeoScheme',
    icon: <BiGlobe />,
  },
  {
    name: 'Countries',
    definition: 'Parsed by commas',
    icon: <GoGlobe />,
    parse: true,
  },
  {
    name: 'Language Family',
    definition: 'Family reunion',
    icon: <GiFamilyTree />,
  },
  {
    name: 'Neighborhoods',
    definition: 'Only NYC',
    icon: <BiMapPin />,
    parse: true,
  },
  {
    name: 'Status',
    definition: 'See Help',
    icon: <HiOutlineOfficeBuilding />,
  },
] as Types.CategoryConfig[]
