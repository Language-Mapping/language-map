import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { DetailedIntro, NeighborhoodList } from 'components/details'
import { LoadingIndicatorPanel } from 'components/generic/modals'
import { PanelContentSimple } from 'components/panels'
import { useAirtable } from './hooks'

import * as Types from './types'

// aka pre-Details, aka Language Profile
export const LangCardsList: FC<{ field?: string }> = (props) => {
  const { field: explicitField } = props
  const { field, value, language } = useParams() as Types.RouteMatch

  let filterByFormula
  if (explicitField) filterByFormula = `{name} = '${language}'`
  else
    filterByFormula = `AND(FIND('${value}', ARRAYJOIN({${field}})) != 0, {name} = '${language}')`

  const { data, error, isLoading } = useAirtable('Language', {
    filterByFormula,
  })

  if (isLoading) return <LoadingIndicatorPanel />
  if (error) return <PanelContentSimple>{error?.message}</PanelContentSimple>
  if (!data.length)
    return <PanelContentSimple>No match found.</PanelContentSimple>

  const thisLangConfig = data[0] || {}

  return (
    <PanelContentSimple>
      <DetailedIntro data={thisLangConfig} />
      <NeighborhoodList data={thisLangConfig} />
    </PanelContentSimple>
  )
}
