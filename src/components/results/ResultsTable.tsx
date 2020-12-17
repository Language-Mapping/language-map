/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'
import MaterialTable from 'material-table'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { SimpleDialog } from 'components/generic/modals'
import { paths as routes } from 'components/config/routes'
import { DetailsPanel } from 'components/details'
import { LangRecordSchema } from 'components/context/types'
import { MuiTableWithLangs } from './types'
import { ResultsToolbar } from './ResultsToolbar'

import * as Types from './types'
import * as config from './config'

export const ResultsTable: FC<Types.ResultsTableProps> = (props) => {
  const { data: tableData } = props
  const history = useHistory()
  const loc = useLocation()
  const tableRef = React.useRef<MuiTableWithLangs>(null)
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)

  // TODO: some kind of `useState` to set asc/desc and sort Neighborhood
  // properly (blanks last, regardless of direction)

  const onRowClick = (
    event: React.MouseEvent,
    rowData: LangRecordSchema
  ): void => {
    if (!tableRef || !tableRef.current || !event || !rowData) return

    const self = tableRef.current
    const { dataManager } = self
    const { columns } = dataManager.getRenderState()
    const path = event.nativeEvent.composedPath() // cross-platform

    const tdElem = path.find((elem) => {
      const asElement = elem as HTMLTableCellElement

      return asElement.nodeName === 'TD'
    }) as HTMLTableCellElement

    // Events like closing the Endo img dialog will trigger the click but
    // lack a TD element
    if (!tdElem) return

    const colIndex = tdElem.cellIndex
    const { field } = columns[colIndex]
    const newFilterVal = rowData[field]

    // Show feature in map
    if (field === 'id') {
      history.push(`${routes.details}/${rowData.id}`)

      return
    }

    // Don't set filter for image-only Endonyms
    if (field === 'Endonym' && rowData['Font Image Alt']) return

    // Open Details modal
    if (field === 'Description') {
      history.push(`${routes.table}/${rowData.id}`)

      return
    }

    const newlyFiltered = columns.map(
      (column: Types.ColumnWithTableData, i) => ({
        ...column,
        tableData: {
          ...column.tableData,
          filterValue:
            colIndex === i ? newFilterVal : column.tableData.filterValue,
        },
      })
    )

    columns.forEach((col: Types.ColumnWithTableData, i: number) => {
      dataManager.changeFilterValue(i, newlyFiltered[i].tableData.filterValue)
    })

    self.setState({ ...dataManager.getRenderState(), columns: newlyFiltered })

    setClearBtnEnabled(true)
    scrollToTop()
  }

  // Filter changes, etc. keep the table at its current vertical scroll, often
  // at the bottom, which is super annoying.
  function scrollToTop() {
    if (!tableRef || !tableRef.current) return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // nooooooo thanks
    const divRef = tableRef.current.tableContainerDiv

    if (divRef && divRef.current) divRef.current.scrollIntoView(true)
  }

  return (
    <>
      <Route path="/table/:id">
        <SimpleDialog
          open
          lessHorizPad // Details already has it
          onClose={() =>
            history.push({
              pathname: routes.table,
              state: {
                ...(loc.state as Types.HistoryState),
                pathname: loc.pathname,
              },
            })
          }
        >
          <DetailsPanel />
        </SimpleDialog>
      </Route>
      <MaterialTable
        icons={config.icons}
        tableRef={tableRef}
        options={{
          ...config.options,
          exportCsv: (defs, data) => {
            import('./exporting' /* webpackChunkName: "exporting" */)
              .then(({ exportCsv }) => exportCsv(defs, data))
              .catch(() => {
                throw new Error(
                  '😱 Uh oh! Could not import the exporting utility'
                )
              })
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          exportPdf: (defs, data) => {
            import('./exporting' /* webpackChunkName: "exporting" */)
              .then(({ exportPdf }) => exportPdf(defs, data))
              .catch(() => {
                throw new Error(
                  '😱 Uh oh! Could not import the exporting utility'
                )
              })
          },
        }}
        columns={config.columns}
        localization={config.localization}
        data={tableData}
        onChangeRowsPerPage={() => scrollToTop()}
        onChangePage={() => scrollToTop()}
        onSearchChange={() => scrollToTop()}
        onRowClick={(event, rowData): void => {
          if (!tableRef || !tableRef.current || !event || !rowData) return

          onRowClick(event, rowData)
        }}
        components={{
          Toolbar: (toolbarProps) => (
            <ResultsToolbar
              {...toolbarProps}
              {...{
                setClearBtnEnabled,
                tableRef,
                clearBtnEnabled,
                scrollToTop,
              }}
            />
          ),
        }}
        // Works but laggy:
        onFilterChange={() => {
          setClearBtnEnabled(true)
          scrollToTop()
        }}
        // CANNOT get this to work without setting the focus to the clear btn
        // onSearchChange={(search) => setClearBtnEnabled(true)}
        actions={[
          {
            icon: () => <AiOutlineQuestionCircle />,
            tooltip: 'Help',
            isFreeAction: true,
            onClick: () =>
              // Avoid an infinite cycle of table-help-table backness
              history.push({
                pathname: '/help',
                state: { from: loc.pathname }, // TODO: spread ...loc.state ??
              }),
          },
        ]}
      />
    </>
  )
}
