import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { useAirtable } from './hooks'
import { prepFormula, prepFields } from './utils'
import { CardList } from './CardList'
import { TonsWithAddl, MidLevelExploreProps, RouteMatch } from './types'

export const ExploreLanding: FC<MidLevelExploreProps> = (props) => {
  const { field } = useParams<RouteMatch>()
  const { tableName = field, sortByField = 'name' } = props
  const filterByFormula = prepFormula(field)
  const fields = prepFields(tableName, field)

  const { data: instanceData, error, isLoading } = useAirtable<TonsWithAddl>(
    tableName,
    {
      fields,
      ...(filterByFormula && { filterByFormula }),
      sort: [{ field: sortByField }],
    }
  )

  const {
    data: landingData,
    isLoading: isLandingLoading,
    error: landingError,
  } = useAirtable('Schema', {
    fields: ['name', 'definition', 'plural'],
    filterByFormula: `{name} = "${tableName}"`,
  })

  if (isLoading || isLandingLoading) return <LoadingIndicatorBar />
  if (error || landingError) {
    return (
      <>
        Could not load {field}. {error?.message || landingError?.message}
      </>
    )
  }

  return (
    <>
      <BasicExploreIntro introParagraph={landingData[0]?.definition} />
      <CardList data={instanceData} />
    </>
  )
}
