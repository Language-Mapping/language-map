import React, { FC } from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'

import { BasicExploreIntro } from 'components/panels'
import { LoadingIndicatorBar } from 'components/generic/modals'
import { Explanation, UItextFromAirtable } from 'components/generic'
import { icons } from 'components/config'
import { CardListWrap } from './CardList'
import { useAirtable } from './hooks'
import { TonsWithAddl, MidLevelExploreProps } from './types'
import { AddlLanguages } from './AddlLanguages'
import { CustomCard } from './CustomCard'

export const NeighborhoodsInstance: FC<MidLevelExploreProps> = (props) => {
  const { value } = useParams<{ field: string; value: string }>()
  const { url } = useRouteMatch()
  const field = 'Neighborhood'
  const { tableName = field, sortByField = 'name' } = props
  const fields = [
    'Additional Languages',
    'County',
    'data-descrips',
    'endonyms',
    'languages',
    'name',
    'summary',
  ]

  const { data, error, isLoading } = useAirtable<
    TonsWithAddl & {
      name: string
      endonyms: string[]
      County?: string
      summary?: string
      'data-descrips'?: string[]
    }
  >(tableName, {
    fields,
    filterByFormula: `{name} = "${value}"`,
    sort: [{ field: sortByField }],
    maxRecords: 1,
  })

  if (isLoading) return <LoadingIndicatorBar />
  if (error) {
    return (
      <>
        Could not load {value}. {error?.message}
      </>
    )
  }
  const firstRecord = data[0]
  const {
    'data-descrips': dataDescrips,
    'Additional Languages': addlLanguages,
  } = firstRecord

  return (
    <>
      <BasicExploreIntro
        title={value}
        icon={icons.Neighborhood}
        introParagraph={firstRecord?.summary}
        subtitle={firstRecord?.County}
      />
      {firstRecord?.languages ? (
        <Explanation>
          <UItextFromAirtable id="neighb-loc-list" />
        </Explanation>
      ) : null}
      <CardListWrap>
        {firstRecord?.languages?.map((langName, i) => (
          <CustomCard
            key={langName}
            intro={langName}
            title={firstRecord?.endonyms[i]}
            footer={dataDescrips ? dataDescrips[i] : ''}
            url={`${url}/${langName}`}
          />
        ))}
      </CardListWrap>
      {addlLanguages && <AddlLanguages data={addlLanguages} />}
    </>
  )
}
