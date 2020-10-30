import React, { FC, useContext } from 'react'
import { Route, Switch, useRouteMatch, useParams, Link } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { GlobalContext } from 'components'
import { Categories } from './Categories'
import Breadcrumbs from './Breadcrumbs'
import { LangRecordSchema } from '../../context/types'
import * as utils from './utils'

const Field: FC = () => {
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

  return (
    <div>
      <Breadcrumbs />
      <Typography variant="h3">{field}</Typography>
      <ul>
        {uniqueInstances.map((instance) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <li key={instance}>
            {/* @ts-ignore */}
            <Link to={`${url}/${instance}`}>{instance}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const NoneFound: FC = () => (
  <div>No communities available. Try clicking "Clear filters" above.</div>
)

const FieldValue: FC = () => {
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
    <>
      <Breadcrumbs />
      <Typography variant="h3">{value}</Typography>
      <p style={{ fontSize: 10, textAlign: 'left' }}>
        <b>@Ross:</b> These lists will obviously be styled. I'd like to reuse
        the "Card" theme like at the "Categories" level. We'd have to decide on
        the content though. Probably any Category except Language would use
        Language as the heading for each card?
      </p>
      <ul>
        {matchedComms.map((comm) => (
          <li key={comm.ID}>
            <Link to={`/details/${comm.ID}`}>{comm.ID}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const Sift: FC = () => {
  // The `path` lets us build <Route> paths that are relative to the parent
  // route, while the `url` lets us build relative links.
  const { path } = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <Categories />
        </Route>
        <Route path={`${path}/:field/:value`}>
          <FieldValue />
        </Route>
        <Route path={`${path}/:field`}>
          <Field />
        </Route>
      </Switch>
    </div>
  )
}
