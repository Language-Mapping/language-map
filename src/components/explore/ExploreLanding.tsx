import React, { FC } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { SwatchOnly } from 'components/legend'
import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { CustomCard } from './CustomCard'
import { CardList } from './CardList'
import { useAirtable } from './hooks'
import { prepFormula, prepFields, getUniqueInstances } from './utils'
import { TonsWithAddl, MidLevelExploreProps, RouteMatch } from './types'

export const ExploreLanding: FC<MidLevelExploreProps> = (props) => {
  const { field } = useParams<RouteMatch>()
  const { tableName = field, sortByField = 'name' } = props
  const { url } = useRouteMatch()
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
      <CardList>
        {instanceData.map((row) => {
          const uniqueInstances = getUniqueInstances(field, row)
          const nameOrLang = row.name || row.Language

          return (
            <CustomCard
              key={nameOrLang}
              intro={field === 'Language' ? nameOrLang : ''}
              title={tableName === 'Language' ? row.Endonym : nameOrLang}
              uniqueInstances={uniqueInstances}
              url={`${url}/${nameOrLang}`}
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
                      alt={nameOrLang}
                    />
                  )}
                </>
              }
            />
          )
        })}
      </CardList>
    </>
  )
}
