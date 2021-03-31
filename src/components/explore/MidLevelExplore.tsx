import React, { FC } from 'react'
import { useParams, Route, Link as RouterLink } from 'react-router-dom'

import { FlagFromHook } from 'components/generic/icons-and-swatches'
import { SwatchOnly } from 'components/legend'
import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { Explanation } from 'components/generic'
import { LangLevelSchema } from 'components/context'
import { icons } from 'components/config'
import { routes } from 'components/config/api'
import { CardList } from './CardList'
import { useAirtable } from './hooks'
import { prepFormula, prepFields } from './utils'
import { TonsWithAddl, MidLevelExploreProps, RouteMatch } from './types'

export const AddlLanguages: FC<{ data: LangLevelSchema[]; value?: string }> = (
  props
) => {
  const { data } = props
  const { value } = useParams<{ field: string; value: string }>()

  const addlLanguages = data.filter(
    (row) =>
      // Gross extra step for Airtable FIND issue, which returns in ARRAYJOIN
      // things like "East Elmhurst" in an "Elmhurst" query:
      row.addlNeighborhoods?.includes(value) &&
      !row['Primary Locations'].includes(value)
  )

  if (!addlLanguages.length) return null

  return (
    <>
      <Explanation>
        Additional languages spoken in this neighborhood:
      </Explanation>
      <ul>
        {addlLanguages.map((row) => (
          <li key={row.name}>
            <RouterLink to={`${routes.explore}/Language/${row.name}`}>
              {row.name}
            </RouterLink>
          </li>
        ))}
      </ul>
    </>
  )
}

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
        Could not load {value}. {error?.message || landingError?.message}
      </>
    )
  }

  const { definition } = landingData[0] || {}

  let primaryData
  let Icon = null // TODO: re-componentize

  if (field === 'World Region') {
    Icon = <SwatchOnly backgroundColor={data ? data[0].worldRegionColor : ''} />
  } else if (field === 'Country') Icon = <FlagFromHook value={value} />
  else Icon = <>{icons[field]}</>

  if (field === 'Neighborhood')
    primaryData = data.filter((row) => row['Primary Locations'].includes(value))
  // Gross extra steps for Airtable FIND issue, which returns in ARRAYJOIN
  // things like "Dominican Republic" in a "Dominica" query:
  else if (Array.isArray(data[0][field]))
    primaryData = data.filter((row) => row[field]?.includes(value))
  else primaryData = data

  return (
    <>
      <Route path="/Explore/:level1/:level2" exact>
        <BasicExploreIntro
          title={value}
          icon={Icon}
          introParagraph={!value && definition}
        />
      </Route>
      <Route path="/Explore/Neighborhood/:language" exact>
        <Explanation>
          {/* TODO: from AT */}
          Languages with a significant site in this neighborhood, marked by a
          point on the map:
        </Explanation>
      </Route>
      <CardList data={primaryData} tableName={tableName} />
      <Route path="/Explore/Neighborhood/:value">
        <AddlLanguages data={data} />
      </Route>
    </>
  )
}
