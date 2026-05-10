/* eslint-disable react/display-name */
import React, { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SimpleDialog } from 'components/generic/modals'
import { routes } from 'components/config/api'
import { Details, useDetails } from 'components/details'

export const DetailsModal: FC = () => {
  const navigate = useNavigate()
  const loc = useLocation()
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
      maxWidth="md"
      open
      onClose={() =>
        navigate(routes.data, {
          state: {
            ...((loc.state as Record<string, unknown>) || {}),
            pathname: loc.pathname,
          },
        })
      }
    >
      <Details {...{ instanceDescripID, langDescripID, data }} />
    </SimpleDialog>
  )
}
