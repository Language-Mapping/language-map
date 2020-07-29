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

export const ResultsTable: FC = () => {
  const { state } = useContext(GlobalContext)
  const history = useHistory()

  const columns = [
    { title: 'Language', field: 'Language' },
    { title: 'Endonym', field: 'Endonym' },
    { title: 'Neighborhood', field: 'Neighborhood' }, // TODO: inc. 2ndary
    { title: 'Community Size', field: 'Community Size' },
    { title: 'Type', field: 'Type' },
    { title: 'Region', field: 'Region' },
    { title: 'Primary Country', field: 'Primary Country' },
    { title: 'Global Speaker Total', field: 'Global Speaker Total' },
    { title: 'Language Family', field: 'Language Family' },
    // { title: 'Description', field: 'Description' }, // TODO: restore/truncate
    // TODO: adapt and restore
    // {
    //   title: 'Birth Year',
    //   field: 'birthYear',
    //   type: 'numeric',
    // },
    // {
    //   title: 'Birth Place',
    //   field: 'birthCity',
    //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    // },
  ]
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
      onRowClick={(a, b) => {
        if (!b) {
          return
        }
        history.push(`/details?id=${b.ID}`)
      }}
    />
  )
}
