import React from 'react'
import { BiUserVoice, BiGlobe, BiMapPin } from 'react-icons/bi'
import { GoGlobe } from 'react-icons/go'
import { GiFamilyTree } from 'react-icons/gi'
import { IoIosPeople } from 'react-icons/io'
import { FaCity } from 'react-icons/fa'

import { DetailsSchema } from 'components/context/types'

type ExploreIcon = {
  [key in keyof Partial<DetailsSchema>]: React.ReactNode
}

export const exploreIcons: ExploreIcon = {
  Country: <GoGlobe />,
  Language: <BiUserVoice />,
  Macrocommunity: <IoIosPeople />,
  Neighborhood: <BiMapPin />,
  Town: <FaCity />,
  'Language Family': <GiFamilyTree />,
  'World Region': <BiGlobe />,
}
