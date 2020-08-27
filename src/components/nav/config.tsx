import React from 'react'
import { MdChat } from 'react-icons/md'
import { GoInfo } from 'react-icons/go'

export const PAGE_HEADER_ID = 'page-header'

export const primaryNavConfig = [
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
      'Bug reports, suggest corrections, feature requests, questions, kudos, comments. Simplest: Google Forms or similar.',
    icon: <MdChat />,
  },
]
