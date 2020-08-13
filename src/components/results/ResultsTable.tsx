import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'

import { GlobalContext } from 'components'
import * as config from './config'

type ResultsTableComponent = {
  setResultsModalOpen: React.Dispatch<boolean>
}

export const ResultsTable: FC<ResultsTableComponent> = ({
  setResultsModalOpen,
}) => {
  const { state, dispatch } = useContext(GlobalContext)
  const history = useHistory()

  return (
    <MaterialTable
      icons={config.icons}
      options={config.options}
      columns={config.columns}
      data={state.langFeatures}
      onRowClick={(a, record) => {
        if (!record) {
          return
        }

        history.push(`/details?id=${record.ID}`)

        dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: 2 })
        setResultsModalOpen(false)
      }}
    />
  )
}
