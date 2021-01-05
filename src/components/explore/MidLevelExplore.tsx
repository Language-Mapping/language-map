import React, { FC } from 'react'
import { useRouteMatch, useParams, Route } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { BiMapPin } from 'react-icons/bi'
import { FlagFromHook } from 'components/generic/icons-and-swatches'
import { SwatchOnly } from 'components/legend'
import { PanelContent } from 'components/panels/PanelContent'
import { LoadingIndicatorPanel } from 'components/generic/modals'
import { DetailsSchema, LangLevelSchema } from 'components/context'
import { exploreIcons } from 'components/explore/config'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import * as Types from './types'
import { useAirtable } from './hooks'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: { marginBottom: '1.5em' },
    addlNeighbsList: {
      margin: 0,
      fontSize: '1rem',
    },
    explanation: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      margin: '1rem 0',
    },
  })
)

// Mid-level formulas are pretty consistent, except:
//  1. /Explore/Landing does not need a formula
//  2. /Explore/{anything with array field in Language}/:value must check for
//     value existence and then a "contains" since there does not appear to be a
//     way to filter arrays in Airtable.
const prepFormula = (field: keyof DetailsSchema, value?: string): string => {
  if (field === 'Language') return '' // /Explore/Language
  if (!value) return "{languages} != ''" // e.g. /Explore/Country

  const midLevelArrayFields = [
    'Country',
    'Macrocommunity',
    'Neighborhood',
    'Town',
  ]

  if (value && field === 'Neighborhood')
    return `AND(
      {${field}} != '',
      FIND(
        '${value}',
        CONCATENATE(
          ARRAYJOIN({${field}}),
          ARRAYJOIN({addlNeighborhoods})
        )
      ) != 0
    )`

  if (value && midLevelArrayFields.includes(field))
    return `AND({${field}} != '', FIND('${value}', ARRAYJOIN({${field}})) != 0)`

  if (value) return `{${field}} = '${value}'`

  return ''
}

// Mid-level fields are consistent except a couple tables need an extra field.
const prepFields = (tableName: keyof DetailsSchema): string[] => {
  if (tableName === 'Language')
    return [
      'Endonym',
      'name',
      'Primary Locations',
      'worldRegionColor',
      'addlNeighborhoods',
    ]

  const landingFields = ['name', 'languages']
  const addlFields: {
    [key: string]: string[]
  } = {
    'World Region': [...landingFields, 'icon-color'],
    Country: [...landingFields, 'src_image'],
  }

  if (addlFields[tableName] !== undefined) return addlFields[tableName]

  return landingFields
}

const Explanation: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return (
    <Typography component="p" className={classes.explanation} paragraph>
      {children}
    </Typography>
  )
}

const AddlLanguages: FC<{ data: LangLevelSchema[]; value?: string }> = (
  props
) => {
  const { data } = props
  const { value } = useParams<{ value: string }>()
  const addlLanguages = data.filter(
    (row) => !row['Primary Locations'].includes(value)
  )

  if (!addlLanguages.length) return null

  return (
    <>
      <Explanation>Additional languages spoken in this community:</Explanation>
      <ul>
        {addlLanguages.map((row) => (
          <li key={row.name}>{row.name}</li>
        ))}
      </ul>
    </>
  )
}

export const MidLevelExplore: FC<Types.MidLevelExploreProps> = (props) => {
  const { field, value } = useParams() as Types.RouteMatch
  const { tableName = field, sortByField = 'name' } = props
  const { url } = useRouteMatch()

  const filterByFormula = prepFormula(field, value)
  const fields = prepFields(tableName)

  const { data, error, isLoading } = useAirtable(tableName, {
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
    filterByFormula: `{name} = '${tableName}'`,
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

  let Icon = null // TODO: re-componentize

  if (value && field === 'World Region') {
    Icon = <SwatchOnly backgroundColor={data ? data[0].worldRegionColor : ''} />
  } else if (value && field === 'Country') Icon = <FlagFromHook value={value} />
  else Icon = <>{exploreIcons[field]}</>

  let primaryData

  if (value && field === 'Neighborhood') {
    primaryData = data.filter((row) => row['Primary Locations'].includes(value))
  } else {
    primaryData = data
  }

  // TODO: better logic for instances, e.g. allow definition
  return (
    <PanelContent
      title={value || plural}
      icon={Icon}
      introParagraph={!value && definition}
    >
      <Route path="/Explore/Neighborhood">
        <Explanation>
          Languages with a significant site in this community, marked by a point
          on the map:
        </Explanation>
      </Route>
      <CardList>
        {primaryData.map((row) => {
          let uniqueInstances = []

          if (row.languages) {
            uniqueInstances = row.languages
            // FIXME: include additional neighbs in card footers:
            // else if (!value && field === 'Neighborhood' && row.addlNeighborhoods){
          } else {
            uniqueInstances = row['Primary Locations']
          }

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
