import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { CensusIntroProps } from './types'

const baseCensusText =
  "The Census Bureau's American Community Survey (ACS) provides an indication of where the largest several dozen languages are distributed."

// Only shown in the Census panel at time of writing, not CensusPopover.
const extendedCensusText =
  'The options below represent 5-year ACS estimates on "language spoken at home for the Population 5 Years and Over", sorted by population size.'

export const CensusIntro: FC<CensusIntroProps> = (props) => {
  const { subtle } = props

  return (
    <>
      {`${baseCensusText} `}
      {!subtle && extendedCensusText}{' '}
      <RouterLink to="/Info/About#census">More info</RouterLink>
    </>
  )
}
