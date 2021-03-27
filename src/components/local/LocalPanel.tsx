import React, { FC } from 'react'

import { AllLangDataToggle } from 'components/legend'
import { Explanation } from 'components/generic'
import { CensusFieldSelect } from './CensusFieldSelect'
import { CensusIntro } from './CensusIntro'
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
    </>
  )
}
