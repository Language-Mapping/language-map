import React from 'react'
import { MdShare, MdHome, MdChat } from 'react-icons/md'
import { GoGear, GoInfo } from 'react-icons/go'

export const primaryNavConfig = [
  {
    url: '/',
    primaryText: 'Home',
    secondaryText: 'The main map view',
    icon: <MdHome />,
  },
  {
    url: '/about',
    primaryText: 'About',
    secondaryText: 'Privacy policy, data sources',
    icon: <GoInfo />,
  },
  {
    url: '/contact',
    primaryText: 'Contact & Feedback',
    secondaryText:
      'Bug reports, suggest corrections, feature requests, questions, kudos, other comments. Simplest: Google Forms or similar.',
    icon: <MdChat />,
  },
]

export const secondaryNavConfig = [
  {
    url: '/share',
    primaryText: 'Share',
    secondaryText:
      'Maybe just a btn elsewhere, but could consider this second chance to market.',
    icon: <MdShare />,
  },
  {
    url: '/settings',
    primaryText: 'Settings',
    secondaryText: 'Relevant? Just "auto-zoom on filter change" so far.',
    icon: <GoGear />,
  },
]
