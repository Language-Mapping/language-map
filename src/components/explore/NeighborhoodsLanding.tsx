import React, { FC } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { useAirtable } from './hooks'
import { prepFormula, prepFields, getUniqueInstances } from './utils'
import { CardListWrap } from './CardList'
import { TonsWithAddl } from './types'
import { CustomCard } from './CustomCard'
import { LayerToggle } from './LayerToggle'

export const NeighborhoodsLanding: FC = (props) => {
  const tableName = 'Neighborhood'
  const filterByFormula = prepFormula(tableName)
  const fields = prepFields(tableName, tableName)
  const { url } = useRouteMatch()

  const { data: instanceData, error, isLoading } = useAirtable<
    TonsWithAddl & { County?: string }
  >('Neighborhood', {
    fields,
    ...(filterByFormula && { filterByFormula }),
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
        extree={<LayerToggle layerID="neighborhoods" />}
      />
      <CardListWrap>
        {instanceData.map((row) => {
          const uniqueInstances = getUniqueInstances('Neighborhood', row)
          const { name } = row

          return (
            <CustomCard
              key={name}
              intro={row.County}
              title={name}
              uniqueInstances={uniqueInstances}
              url={`${url}/${name}`}
            />
          )
        })}
      </CardListWrap>
    </>
  )
}
