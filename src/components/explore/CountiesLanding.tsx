import React, { FC } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicator } from 'components/generic/modals'
import { useAirtable } from './hooks'
import { CardListWrap } from './CardList'
import { CustomCard } from './CustomCard'

export const CountiesLanding: FC = (props) => {
  const tableName = 'County'
  const { url } = useRouteMatch()

  const {
    data: landingData,
    isLoading: isLandingLoading,
    error: landingError,
  } = useAirtable('Schema', {
    fields: ['name', 'definition', 'plural'],
    filterByFormula: `{name} = "${tableName}"`,
  })

  const { data: instanceData, error, isLoading } = useAirtable<{
    name: string
    languages: string
  }>('County', {
    fields: ['name', 'languages'],
    filterByFormula: "{languages} != ''",
    sort: [{ field: 'name' }],
  })

  if (error || landingError) {
    return (
      <>
        Could not load {tableName}. {error?.message || landingError?.message}
      </>
    )
  }

  return (
    <>
      <BasicExploreIntro
        introParagraph={landingData[0]?.definition}
        expand={!isLandingLoading}
      />
      {(isLoading && <LoadingIndicator omitText />) || (
        <CardListWrap>
          {instanceData.map((row, i) => {
            const { name } = row

            return (
              <CustomCard
                key={name}
                title={name}
                noAnimate={i > 25}
                timeout={350 + i * 250}
                url={`${url}/${name}`}
                // the ONLY non-array?
                uniqueInstances={row.languages.split(', ')}
              />
            )
          })}
        </CardListWrap>
      )}
    </>
  )
}
