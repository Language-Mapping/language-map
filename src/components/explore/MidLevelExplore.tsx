import React, { FC } from 'react'
import {
  useRouteMatch,
  useParams,
  Route,
  Link as RouterLink,
} from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BiMapPin } from 'react-icons/bi'

import { FlagFromHook } from 'components/generic/icons-and-swatches'
import { SwatchOnly } from 'components/legend'
import { PanelContent } from 'components/panels/PanelContent'
import { LoadingIndicatorPanel } from 'components/generic/modals'
import { Explanation } from 'components/generic'
import { LangLevelSchema } from 'components/context'
import { exploreIcons } from 'components/explore/config'
import { routes } from 'components/config/api'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { useAirtable } from './hooks'
import { prepFormula, prepFields, getUniqueInstances } from './utils'
import { TonsWithAddl, MidLevelExploreProps, RouteMatch } from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: { marginBottom: '1.5em' },
    addlNeighbsList: {
      margin: 0,
      fontSize: '1rem',
    },
  })
)

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
  const { field, value } = useParams<RouteMatch>()
  const { tableName = field, sortByField = 'name' } = props
  const { url } = useRouteMatch()
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

  if (isLoading || isLandingLoading) return <LoadingIndicatorPanel />
  if (error || landingError) {
    return (
      <PanelContent>
        Could not load {value || field}.{' '}
        {error?.message || landingError?.message}
      </PanelContent>
    )
  }

  const footerIcon = (value !== undefined || tableName === 'Language') && (
    <BiMapPin />
  )
  const { definition, plural } = landingData[0] || {}

  let primaryData
  let Icon = null // TODO: re-componentize

  if (value && field === 'World Region') {
    Icon = <SwatchOnly backgroundColor={data ? data[0].worldRegionColor : ''} />
  } else if (value && field === 'Country') Icon = <FlagFromHook value={value} />
  else Icon = <>{exploreIcons[field]}</>

  if (value && field === 'Neighborhood')
    primaryData = data.filter((row) => row['Primary Locations'].includes(value))
  // Gross extra steps for Airtable FIND issue, which returns in ARRAYJOIN
  // things like "Dominican Republic" in a "Dominica" query:
  else if (value && Array.isArray(data[0][field]))
    primaryData = data.filter((row) => row[field]?.includes(value))
  else primaryData = data

  // TODO: better logic for instances, e.g. allow definition
  return (
    <PanelContent
      title={value || plural}
      icon={Icon}
      introParagraph={!value && definition}
    >
      <Route path="/Explore/Neighborhood/:language" exact>
        <Explanation>
          Languages with a significant site in this neighborhood, marked by a
          point on the map:
        </Explanation>
      </Route>
      <CardList>
        {primaryData.map((row) => {
          const uniqueInstances = getUniqueInstances(field, row, value)

          return (
            <CustomCard
              key={row.name || row.Language}
              title={row.name || row.Language}
              intro={row.Endonym}
              footerIcon={footerIcon}
              uniqueInstances={uniqueInstances}
              url={`${url}/${row.name || row.Language}`}
              // TODO: use and refactor SwatchOrFlagOrIcon for icon prop
              icon={
                <>
                  {row['icon-color'] && (
                    <SwatchOnly backgroundColor={row['icon-color']} />
                  )}
                  {row.src_image && (
                    <img
                      style={{ height: '0.8em', marginRight: '0.25em' }}
                      src={row.src_image[0].url}
                      alt={row.name || row.Language}
                    />
                  )}
                </>
              }
            />
          )
        })}
      </CardList>
      <Route path="/Explore/Neighborhood/:value">
        <AddlLanguages data={data} />
      </Route>
    </PanelContent>
  )
}
