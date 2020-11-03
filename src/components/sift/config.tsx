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
    definition: 'Common language name in English',
    icon: <BiUserVoice />,
  },
  {
    name: 'World Region',
    definition: 'As defined by the UN geoscheme',
    icon: <BiGlobe />,
  },
  {
    name: 'Countries',
    definition: 'Estimated to have the largest concentration of speakers',
    icon: <GoGlobe />,
    parse: true,
  },
  {
    name: 'Language Family',
    definition:
      'Group of languages related through descent from a common ancestral language',
    icon: <GiFamilyTree />,
  },
  {
    name: 'Neighborhoods',
    definition: 'Local name, for NYC locations only',
    icon: <BiMapPin />,
    parse: true,
  },
  {
    name: 'Status',
    definition: 'How, when, where the language is or has been used locally',
    icon: <HiOutlineOfficeBuilding />,
  },
] as Types.CategoryConfig[]
