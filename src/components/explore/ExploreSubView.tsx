import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { SwatchOrFlagOrIcon } from 'components/generic/icons-and-swatches'
import { PanelContent } from 'components/panels/PanelContent'

import * as Types from './types'

export const ExploreSubView: FC<Types.ExploreSubViewProps> = (props) => {
  const { children, instancesCount, subtitle, subSubtitle, extree } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const isLanguage = language || field === 'Language'

  return (
    <PanelContent
      title={language || value || field}
      icon={
        <SwatchOrFlagOrIcon
          field={isLanguage ? 'Language' : field}
          value={value}
        />
      }
      subtitle={subtitle}
      extree={extree}
      subSubtitle={subSubtitle}
    >
      {(instancesCount && children) || 'No communities available.'}
    </PanelContent>
  )
}
