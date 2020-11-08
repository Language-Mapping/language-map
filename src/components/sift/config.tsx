import React from 'react'
import { BiUserVoice, BiGlobe, BiMapPin } from 'react-icons/bi'
import { GoGlobe } from 'react-icons/go'
import { GiFamilyTree } from 'react-icons/gi'
import { IoIosPeople } from 'react-icons/io'

import * as Types from './types'

// NOTE: the definitions were manually truncated/massaged
// TODO: rm them if not using
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
    name: 'Country',
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
    name: 'Neighborhood',
    definition: 'Local name, for NYC locations only',
    icon: <BiMapPin />,
    parse: true,
  },
  {
    name: 'Macrocommunity',
    definition: 'Will need a definition here...',
    icon: <IoIosPeople />,
  },
] as Types.CategoryConfig[]
