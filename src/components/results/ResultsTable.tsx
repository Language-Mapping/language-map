import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
// TODO: look into Column
// import MaterialTable, { Column } from 'material-table'
import MaterialTable from 'material-table'
import { FaFilter } from 'react-icons/fa'
import {
  MdSearch,
  MdClear,
  MdChevronLeft,
  MdChevronRight,
  MdLastPage,
  MdFirstPage,
} from 'react-icons/md'

import { GlobalContext } from 'components'
import { columns } from './config'

type ResultsTableComponent = {
  setResultsModalOpen: React.Dispatch<boolean>
}
export const ResultsTable: FC<ResultsTableComponent> = ({
  setResultsModalOpen,
}) => {
  const { state, dispatch } = useContext(GlobalContext)
  const history = useHistory()

  const options = {
    showTitle: false,
    filtering: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  }

  const icons = {
    Search: MdSearch,
    Filter: FaFilter,
    ResetSearch: MdClear,
    FirstPage: MdFirstPage,
    LastPage: MdLastPage,
    PreviousPage: MdChevronLeft,
    NextPage: MdChevronRight,
  }

  return (
    <MaterialTable
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      icons={icons}
      options={options}
      columns={columns}
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
