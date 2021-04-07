/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { Route, useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'

import { routes } from 'components/config/api'
import { InstanceLevelSchema } from 'components/context'
import { DetailsModal } from './DetailsModal'
import { FILTER_CLASS } from './utils'
import { ResultsToolbar } from './ResultsToolbar'
import { icons, options, columns as columnConfig, localization } from './config'
import {
  ResultsTableProps,
  ColumnWithTableData,
  MuiTableWithLangs,
} from './types'

export const ResultsTable: FC<ResultsTableProps> = (props) => {
  const { data: tableData } = props
  const history = useHistory()
  const tableRef = React.useRef<MuiTableWithLangs>(null)
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)

  // REFACTOR: get this monster into utils or events or something
  const onRowClick = (
    event: React.MouseEvent,
    rowData: InstanceLevelSchema
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

    // Show feature in map
    if (field === 'id') {
      history.push(`/Explore/Language/${rowData.Language}/${rowData.id}`)

      return
    }

    // Don't set filter for image-only Endonyms
    if (field === 'Endonym' && rowData['Font Image Alt']) return

    // Has nothing to do with County, just need it for full-screen view
    if (field === 'County') {
      history.push(`${routes.table}/${rowData.id}`) // open Details modal

      return
    }

    // Support multi-line value clicks, e.g. Country, Additional Neighborhoods
    const elemWithFilter = path.find((elem) => {
      const asElement = elem as HTMLElement

      return asElement.classList?.contains(FILTER_CLASS)
    }) as HTMLElement

    // Clicking a country flag cell above or below the content results in no
    // element match, but we can't use the row value because it's an array and
    // the table is expecting a string, and we can't convert it to string
    // because then there won't be a match if there is a newline. 😠
    if (!elemWithFilter && Array.isArray(rowData[field])) return

    // Safari will preserve newlines w/o `trim`
    const newFilterVal = elemWithFilter?.innerText.trim() || rowData[field]

    const newlyFiltered = columns.map((column: ColumnWithTableData, i) => {
      let filterValue

      if (colIndex !== i) filterValue = column.tableData.filterValue
      // Lookup filter types have array values
      else if (column.lookup) filterValue = [newFilterVal]
      else filterValue = newFilterVal

      return {
        ...column,
        tableData: { ...column.tableData, filterValue },
      }
    })

    columns.forEach((col: ColumnWithTableData, i: number) => {
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
        <DetailsModal />
      </Route>
      <MaterialTable
        icons={icons}
        tableRef={tableRef}
        options={{
          ...options,
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
        columns={columnConfig}
        localization={localization}
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
      />
    </>
  )
}
