import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext } from 'components/context'
import { SwatchOrFlagOrIcon } from 'components/generic/icons-and-swatches'
import { PanelContent } from 'components/panels/PanelContent'
import * as Types from './types'
import * as utils from './utils'

export const ExploreSubView: FC<Types.Field> = (props) => {
  const { children, instancesCount, subtitle, subSubtitle } = props
  const { field, value, language } = useParams() as Types.RouteMatch
  const { state } = useContext(GlobalContext)
  const isLanguageField = useRouteMatch('/Explore/Language')

  if (!state.langFeatsLenCache)
    return <PanelContent title="Loading communities..." />

  return (
    <PanelContent
      title={language || value || field}
      intro={utils.pluralTextIfNeeded(instancesCount)}
      icon={
        <SwatchOrFlagOrIcon
          field={
            /* eslint-disable operator-linebreak */
            language || field === 'Language' || isLanguageField
              ? 'Language'
              : field
            /* eslint-enable operator-linebreak */
          }
          value={value}
        />
      }
      subtitle={subtitle}
      subSubtitle={subSubtitle}
    >
      {(instancesCount && children) || 'No communities available.'}
    </PanelContent>
  )
}
