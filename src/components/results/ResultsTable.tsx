import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'
import { FaMapMarkedAlt } from 'react-icons/fa'

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
      actions={[
        {
          // eslint-disable-next-line react/display-name
          icon: () => <FaMapMarkedAlt />,
          tooltip: 'View in map',
          onClick: (event: React.MouseEvent, rowData) => {
            setResultsModalOpen(false)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            history.push(`/details?id=${rowData.ID}`)

            dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: 2 })
          },
        },
      ]}
    />
  )
}
