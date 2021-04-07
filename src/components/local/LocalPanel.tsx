import React, { FC } from 'react'

import { BasicExploreIntro } from 'components/explore'
import { Explanation, UItextFromAirtable } from 'components/generic'
import { CensusFieldSelect } from './CensusFieldSelect'
import { CensusTogglesWrap } from './CensusTogglesWrap'
import { LegendGradient } from './LegendGradient'

// TODO: rename all instances of "Local" to "Census"
export const LocalPanel: FC = () => {
  return (
    <>
      <BasicExploreIntro
        introParagraph={
          <UItextFromAirtable id="census-panel-intro-top" rootElemType="p" />
        }
      />
      <CensusFieldSelect />
      <LegendGradient />
      <CensusTogglesWrap />
      <Explanation>
        <UItextFromAirtable id="census-panel-intro-bottom" />
      </Explanation>
    </>
  )
}
