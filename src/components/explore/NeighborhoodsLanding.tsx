import React, { FC } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicator } from 'components/generic/modals'
import { useAirtable } from './hooks'
import { prepFormula, prepFields, getUniqueInstances } from './utils'
import { CardListWrap } from './CardList'
import { TonsWithAddl } from './types'
import { CustomCard } from './CustomCard'

export const NeighborhoodsLanding: FC = (props) => {
  const tableName = 'Neighborhood'
  const filterByFormula = prepFormula(tableName)
  const fields = prepFields(tableName, tableName)
  const { url } = useRouteMatch()

  const {
    data: landingData,
    isLoading: isLandingLoading,
    error: landingError,
  } = useAirtable('Schema', {
    fields: ['name', 'definition', 'plural'],
    filterByFormula: `{name} = "${tableName}"`,
  })

  const { data: instanceData, error, isLoading } = useAirtable<
    TonsWithAddl & { County?: string }
  >('Neighborhood', {
    fields,
    ...(filterByFormula && { filterByFormula }),
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
        noAppear={!isLandingLoading}
      />
      {(isLoading && <LoadingIndicator omitText />) || (
        <CardListWrap>
          {instanceData.map((row, i) => {
            const uniqueInstances = getUniqueInstances('Neighborhood', row)
            const { name } = row

            return (
              <CustomCard
                key={name}
                intro={row.County}
                noAnimate={i > 25}
                timeout={350 + i * 250}
                title={name}
                uniqueInstances={uniqueInstances}
                url={`${url}/${name}`}
              />
            )
          })}
        </CardListWrap>
      )}
    </>
  )
}
