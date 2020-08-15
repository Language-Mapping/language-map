/* eslint-disable react/display-name */
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { GoFile } from 'react-icons/go'

import { GlobalContext } from 'components'
import * as config from './config'
import { RecordDescription } from './RecordDescription'

const { icons, options, columns, localization } = config

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
      icons={icons}
      options={options}
      columns={columns}
      localization={localization}
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
      detailPanel={[
        {
          icon: () => <GoFile />,
          tooltip: 'Show description',
          render: (rowData) => <RecordDescription text={rowData.Description} />,
        },
      ]}
    />
  )
}
