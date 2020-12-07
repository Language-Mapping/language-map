import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext } from 'components/context'
import { SwatchOrFlagOrIcon } from 'components/generic/icons-and-swatches'
import { PanelContent } from 'components/panels/PanelContent'

import * as Types from './types'

export const ExploreSubView: FC<Types.ExploreSubViewProps> = (props) => {
  const { children, instancesCount, subtitle, subSubtitle, extree } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const isLanguageField = useRouteMatch('/Explore/Language')
  const isLanguage = language || field === 'Language'

  if (!state.langFeatsLenCache)
    return <PanelContent title="Loading communities..." />

  return (
    <PanelContent
      title={language || value || field}
      icon={
        !isLanguageField && (
          <SwatchOrFlagOrIcon
            field={isLanguage ? 'Language' : field}
            value={value}
          />
        )
      }
      subtitle={subtitle}
      extree={extree}
      subSubtitle={subSubtitle}
    >
      {(instancesCount && children) || 'No communities available.'}
    </PanelContent>
  )
}
