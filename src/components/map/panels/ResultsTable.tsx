import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
// TODO: look into Column
// import MaterialTable, { Column } from 'material-table'
import MaterialTable from 'material-table'

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

  return (
    <MaterialTable
      options={{ showTitle: false, filtering: true, hideFilterIcons: true }}
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
