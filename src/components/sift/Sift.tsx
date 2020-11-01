import React, { FC, useContext } from 'react'
import { useRouteMatch, useParams } from 'react-router-dom'

import { GlobalContext } from 'components'
import { Category, CategoriesEasy } from 'components/sift'
import { PanelContent } from '../panels/PanelContent'
import { LangRecordSchema } from '../../context/types'
import * as utils from './utils'
import * as config from './config'

export const Field: FC = () => {
  // The <Route> that rendered this component has a path of `/topics/:topicId`.
  // The `:topicId` portion of the URL indicates a placeholder that we can get
  // from `useParams()`.
  const { field } = useParams() as { field: keyof LangRecordSchema }
  const { url } = useRouteMatch()
  const { state } = useContext(GlobalContext)
  const uniqueInstances = utils.getUniqueInstances(
    field,
    state.langFeatures, // but what if filtered? may need global cache again...
    true // mmmmmmmmmm
  )
  const icon = config.categories.find(({ name }) => name === field)?.icon

  return (
    <PanelContent
      title={field}
      icon={icon}
      intro={`will check to see if ${field.toUpperCase()} has a spesh intro`}
    >
      <CategoriesEasy>
        {uniqueInstances.map((instance) => {
          const asString = instance as string

          return (
            <Category
              key={asString}
              intro="Total w/filts"
              title={asString}
              url={`${url}/${asString}`}
              subtitle={asString}
              uniqueInstances={[]}
            />
          )
        })}
      </CategoriesEasy>
    </PanelContent>
  )
}

const NoneFound: FC = () => (
  <div>No communities available. Try clicking "Clear filters" above.</div>
)

export const FieldValue: FC = () => {
  // The <Route> that rendered this component has a path of `/topics/:topicId`.
  // The `:topicId` portion of the URL indicates a placeholder that we can get
  // from `useParams()`.
  const { field, value } = useParams() as {
    field: keyof LangRecordSchema
    value: string | number | ''
  }
  const { state } = useContext(GlobalContext)
  const { langFeatures, langFeatsLenCache } = state

  if (!langFeatsLenCache) {
    return <p>Loading communities...</p>
  }

  const matchedComms = langFeatures.filter((feat) => {
    return feat[field]?.toString() === value
  })

  if (!matchedComms.length) return <NoneFound />

  return (
    <PanelContent
      title={value.toString()}
      intro={`will check to see if ${value
        .toString()
        .toUpperCase()} has a spesh intro`}
    >
      <CategoriesEasy>
        {matchedComms.map((comm) => {
          let title = comm.Language
          let intro = ''

          if (comm.Glottocode) intro = `Glotto: ${comm.Glottocode}`
          if (comm['ISO 639-3']) intro += ` ISO: ${comm['ISO 639-3']}`

          if (field === 'Language') {
            title = comm.Neighborhoods?.split(', ')[0] || comm.Town
          }

          return (
            <Category
              key={comm.ID}
              intro={intro}
              title={title}
              url={`/details/${comm.ID}`}
              subtitle={comm.Endonym}
              uniqueInstances={[]}
            />
          )
        })}
      </CategoriesEasy>
    </PanelContent>
  )
}
