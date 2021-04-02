import React, { FC } from 'react'
import { useParams, Route } from 'react-router-dom'

import { FlagFromHook } from 'components/generic/icons-and-swatches'
import { SwatchOnly } from 'components/legend'
import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { icons } from 'components/config'
import { CardList } from './CardList'
import { useAirtable } from './hooks'
import { prepFormula, prepFields } from './utils'
import { TonsWithAddl, MidLevelExploreProps, RouteMatch } from './types'
import { LayerToggle } from './LayerToggle'

export const MidLevelExplore: FC<MidLevelExploreProps> = (props) => {
  const { field, value } = useParams<RouteMatch & { value: string }>()
  const { tableName = field, sortByField = 'name' } = props
  const filterByFormula = prepFormula(field, value)
  const fields = prepFields(tableName, field)

  const { data, error, isLoading } = useAirtable<TonsWithAddl>(tableName, {
    fields,
    ...(filterByFormula && { filterByFormula }),
    sort: [{ field: sortByField }],
  })

  if (isLoading) return <LoadingIndicatorBar />
  if (error) {
    return (
      <>
        Could not load {value}. {error?.message}
      </>
    )
  }

  let primaryData
  let Icon = null // TODO: re-componentize

  if (field === 'World Region') {
    Icon = <SwatchOnly backgroundColor={data ? data[0].worldRegionColor : ''} />
  } else if (field === 'Country') Icon = <FlagFromHook value={value} />
  else Icon = <>{icons[field]}</>

  // Gross extra steps for Airtable FIND issue, which returns in ARRAYJOIN
  // things like "Dominican Republic" in a "Dominica" query:
  if (Array.isArray(data[0][field]))
    primaryData = data.filter((row) => row[field]?.includes(value))
  else primaryData = data

  return (
    <>
      <BasicExploreIntro
        title={value}
        icon={Icon}
        extree={
          <Route path="/Explore/County">
            <LayerToggle layerID="counties" />
          </Route>
        }
      />
      <CardList data={primaryData} />
    </>
  )
}
