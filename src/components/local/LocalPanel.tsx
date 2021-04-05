import React, { FC } from 'react'

import { BasicExploreIntro } from 'components/explore'
import { Explanation, UItextFromAirtable } from 'components/generic'
import { CensusFieldSelect } from './CensusFieldSelect'
import { CensusIntro } from './CensusIntro'
import { CensusTogglesWrap } from './CensusTogglesWrap'
import { LegendGradient } from './LegendGradient'

// TODO: rename all instances of "Local" to "Census"
export const LocalPanel: FC = () => {
  return (
    <>
      <BasicExploreIntro introParagraph={<CensusIntro />} />
      <CensusFieldSelect />
      <LegendGradient />
      <CensusTogglesWrap />
      <Explanation>
        <UItextFromAirtable id="census-panel-intro-bottom" />
      </Explanation>
    </>
  )
}
