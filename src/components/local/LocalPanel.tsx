import React, { FC } from 'react'
import { Route } from 'react-router-dom'

import { AllLangDataToggle } from 'components/legend'
import { Explanation } from 'components/generic'
import { routes } from 'components/config/api'
import { CensusFieldSelect } from './CensusFieldSelect'
import { CensusIntro } from './CensusIntro'
import { CensusRecordDetail } from './CensusRecordDetail'
import { CensusAutoZoomToggle } from './CensusAutoZoomToggle'

// TODO: rename all instances of "Local" to "Census"
export const LocalPanel: FC = () => {
  return (
    <>
      <Explanation>
        <CensusIntro />
      </Explanation>
      <CensusFieldSelect />
      <AllLangDataToggle />
      <CensusAutoZoomToggle />
      <Route path={routes.censusDetail} exact>
        <CensusRecordDetail />
      </Route>
    </>
  )
}
