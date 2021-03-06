import React from 'react'
import { FaBinoculars, FaClipboard, FaCity } from 'react-icons/fa'
import { GoInfo, GoGlobe } from 'react-icons/go'
import { BsTable, BsPersonLinesFill } from 'react-icons/bs'
import {
  BiHomeAlt,
  BiUserVoice,
  BiGlobe,
  BiMapPin,
  BiMap,
} from 'react-icons/bi'
import { MdChat } from 'react-icons/md'
import { RiGovernmentLine } from 'react-icons/ri'
import { AiOutlineQuestionCircle, AiFillFilePdf } from 'react-icons/ai'
import { IoSearchOutline } from 'react-icons/io5'
import { GiFamilyTree } from 'react-icons/gi'

import { IoIosPeople } from 'react-icons/io'

export const icons = {
  About: <BsPersonLinesFill />,
  Census: <FaClipboard />,
  Country: <GoGlobe />,
  County: <RiGovernmentLine />,
  Data: <BsTable />,
  Explore: <FaBinoculars />,
  Feedback: <MdChat />,
  Help: <AiOutlineQuestionCircle />,
  Home: <IoSearchOutline />,
  HomeLink: <BiHomeAlt />, // e.g. from the panel title bar top-level routes
  Info: <GoInfo />,
  Language: <BiUserVoice />,
  Macrocommunity: <IoIosPeople />,
  Neighborhood: <BiMapPin />,
  SiteDetails: <BiMap />,
  Town: <FaCity />,
  UserManual: <AiFillFilePdf />, // not actually a route
  'Language Family': <GiFamilyTree />,
  'World Region': <BiGlobe />,
} as {
  [key: string]: React.ReactNode
}
