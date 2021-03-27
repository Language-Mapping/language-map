import React, { FC } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Dialog } from '@material-ui/core'

import { LoadingBackdrop } from 'components/generic/modals'
import * as Types from './types'
import { useStyles } from './styles'
import { createMarkup } from '../../utils'
import { LocWithState } from '../config/types'
import { defaultQueryFn } from './utils'

export const AboutPageView: FC<Types.AboutPageProps> = (props) => {
  const { queryKey, title } = props
  const classes = useStyles()
  const history = useHistory()
  const {
    pathname: currPathname,
    state: locState,
  } = useLocation() as LocWithState
  const { data, isFetching, error } = useQuery(queryKey, () =>
    defaultQueryFn<Types.WpApiPageResponse>(queryKey)
  )

  if (isFetching)
    return (
      <LoadingBackdrop
        centerOnScreen
        text="" // default "Loading..." text kind of annoying here
        testID={`${title?.replace(' ', '').toLowerCase()}-page-backdrop`}
      />
    )

  // Go back in history if route wasn't table-based, otherwise go home. Also
  // avoids an infinite cycle of table-help-table backness.
  // TODO: see notes in ResultsModal
  const handleClose = (): void => {
    if (locState?.from)
      history.push({
        pathname: locState.from,

        state: {
          from: currPathname,
        },
      })
    else history.goBack()
  }

  // TODO: wire up Sentry; aria; TS for error (`error.message` is a string)
  if (error) {
    return (
      <Dialog open onClose={handleClose} maxWidth="md">
        An error has occurred.{' '}
        <span role="img" aria-label="man shrugging emoji">
          🤷‍♂
        </span>
      </Dialog>
    )
  }

  // TODO: use `keepMounted` for About for SEO purposes?
  // TODO: consider SimpleDialog for some or all of these
  return (
    <div className={classes.dialogContent}>
      <div
        dangerouslySetInnerHTML={createMarkup(data?.content.rendered || '')}
        id={`${queryKey}-dialog-description`}
      />
    </div>
  )
}
