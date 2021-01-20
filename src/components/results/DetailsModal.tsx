/* eslint-disable react/display-name */
import React, { FC } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { SimpleDialog } from 'components/generic/modals'
import { routes } from 'components/config/api'
import { Details, useDetails } from 'components/details'
import { UseLocation } from './types'

export const DetailsModal: FC = () => {
  const history = useHistory()
  const loc = useLocation<UseLocation>()
  const {
    isLoading,
    error,
    data,
    instanceDescripID,
    langDescripID,
  } = useDetails()

  if (isLoading || error || !data) return null

  return (
    <SimpleDialog
      open
      onClose={() =>
        history.push({
          pathname: routes.table,
          state: { ...loc.state, pathname: loc.pathname },
        })
      }
    >
      <Details {...{ instanceDescripID, langDescripID, data }} />
    </SimpleDialog>
  )
}
