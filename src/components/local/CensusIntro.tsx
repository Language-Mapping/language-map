import React, { FC } from 'react'
import { Link as RouterLink, Route } from 'react-router-dom'

import { routes } from 'components/config/api'

export const CensusIntro: FC = () => {
  const baseCensusText =
    "The Census Bureau's American Community Survey (ACS) provides an indication of where the largest several dozen languages are distributed."

  return (
    <>
      {baseCensusText}
      {/* Below text is not applicable to census popover... */}
      <Route path={routes.local} exact>
        {' '}
        The options below represent 5-year ACS estimates on "language spoken at
        home for the Population 5 Years and Over" <b>for NYC only</b>, sorted by
        population size.
      </Route>{' '}
      <RouterLink to="/Info/About#census">More info</RouterLink>
    </>
  )
}
