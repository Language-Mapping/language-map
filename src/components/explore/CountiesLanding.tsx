import React, { FC } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { useAirtable } from './hooks'
import { CardListWrap } from './CardList'
import { CustomCard } from './CustomCard'
import { LayerToggle } from './LayerToggle'

export const CountiesLanding: FC = (props) => {
  const tableName = 'County'
  const { url } = useRouteMatch()

  const { data: instanceData, error, isLoading } = useAirtable<{
    name: string
    languages: string
  }>('County', {
    fields: ['name', 'languages'],
    filterByFormula: "{languages} != ''",
    sort: [{ field: 'name' }],
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
        Could not load {tableName}. {error?.message || landingError?.message}
      </>
    )
  }

  return (
    <>
      <BasicExploreIntro
        introParagraph={landingData[0]?.definition}
        extree={<LayerToggle layerID="counties" />}
      />
      <CardListWrap>
        {instanceData.map((row) => {
          const { name } = row

          return (
            <CustomCard
              key={name}
              title={name}
              uniqueInstances={row.languages.split(', ')} // the ONLY non-array?
              url={`${url}/${name}`}
            />
          )
        })}
      </CardListWrap>
    </>
  )
}
