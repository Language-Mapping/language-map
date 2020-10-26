import React, { FC, useContext } from 'react'
import { Route, Switch, useRouteMatch, useParams, Link } from 'react-router-dom'

import { GlobalContext } from 'components'
import { Categories } from './Categories'
import { LangRecordSchema } from '../../context/types'

const Field: FC = () => {
  // The <Route> that rendered this component has a path of `/topics/:topicId`.
  // The `:topicId` portion of the URL indicates a placeholder that we can get
  // from `useParams()`.
  const { field } = useParams()
  const { url } = useRouteMatch()

  return (
    <div>
      Showing all communities by <b>{field}</b>.
      <ul>
        <li>
          <Link to={`${url}/1`}>Lil guys</Link>
        </li>
        <li>
          <Link to={`${url}/2`}>Midsies</Link>
        </li>
        <li>
          <Link to={`${url}/3`}>Big fellas</Link>
        </li>
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
    value: unknown
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
    <ul>
      {matchedComms.map((comm) => (
        <li key={comm.ID}>
          <Link to={`/details/${comm.ID}`}>{comm.ID}</Link>
        </li>
      ))}
    </ul>
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
