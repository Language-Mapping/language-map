import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { DetailedIntro, NeighborhoodList } from 'components/details'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { FullOnEverything } from 'components/details/types'
import { useAirtable } from './hooks'
import { RouteMatch } from './types'

// aka pre-Details, aka Language Profile
export const LangCardsList: FC<{ field?: string }> = (props) => {
  const { field: explicitField } = props
  const { field, value, language } = useParams<RouteMatch>()

  let filterByFormula

  // Very important that things are wrapped in DOUBLE quotes since some values
  // contain single quotes.
  if (explicitField) filterByFormula = `{name} = "${language}"`
  else
    filterByFormula = `AND(FIND("${value}", ARRAYJOIN({${field}})) != 0, {name} = "${language}")`

  // FIXME: this query definitely does NOT get all the fields from
  // `FullOnEverything`, just gave up on TSing it
  const { data, error, isLoading } = useAirtable<FullOnEverything>('Language', {
    filterByFormula,
  })

  if (isLoading) return <LoadingIndicatorBar />
  if (error) return <>{error?.message}</>
  if (!data.length) return <>No match found.</>

  const thisLangConfig = data[0] || {}

  return (
    <>
      <DetailedIntro data={thisLangConfig} />
      <NeighborhoodList data={thisLangConfig} />
    </>
  )
}
