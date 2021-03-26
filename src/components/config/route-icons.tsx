import React from 'react'
import { FaBinoculars, FaClipboard, FaCity } from 'react-icons/fa'
import { GoInfo, GoGlobe } from 'react-icons/go'
import { BsTable } from 'react-icons/bs'
import { BiHomeAlt, BiUserVoice, BiGlobe, BiMapPin } from 'react-icons/bi'

import { GiFamilyTree } from 'react-icons/gi'
import { IoIosPeople } from 'react-icons/io'

export const icons = {
  Census: <FaClipboard />,
  Country: <GoGlobe />,
  Data: <BsTable />,
  Explore: <FaBinoculars />,
  Home: <BiHomeAlt />,
  Info: <GoInfo />,
  Language: <BiUserVoice />,
  Macrocommunity: <IoIosPeople />,
  Neighborhood: <BiMapPin />,
  Town: <FaCity />,
  'Language Family': <GiFamilyTree />,
  'World Region': <BiGlobe />,
} as {
  [key: string]: React.ReactNode
}
