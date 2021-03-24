import React, { FC } from 'react'

import { LocationSearchContent } from 'components/map'
import { AllLangDataToggle } from 'components/legend'
import { CensusFieldSelect } from './CensusFieldSelect'
import { CensusIntro } from './CensusIntro'
import { CensusAutoZoomToggle } from './CensusAutoZoomToggle'

// TODO: rename all instances of "Local" to "Census"
export const LocalPanel: FC = () => {
  return (
    <LocationSearchContent
      heading="Census Language Data (NYC only)"
      explanation={<CensusIntro />}
    >
      <CensusFieldSelect />
      <AllLangDataToggle />
      <CensusAutoZoomToggle />
    </LocationSearchContent>
  )
}
