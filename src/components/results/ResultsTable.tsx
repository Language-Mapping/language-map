/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'
import MaterialTable from 'material-table'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { SimpleDialog } from 'components/generic/modals'
import { routes } from 'components/config/api'
import { DetailsPanel } from 'components/details'
import { DetailsSchema } from 'components/context'
import { MuiTableWithLangs } from './types'
import { FILTER_CLASS } from './utils'
import { ResultsToolbar } from './ResultsToolbar'

import * as Types from './types'
import * as config from './config'

export const ResultsTable: FC<Types.ResultsTableProps> = (props) => {
  const { data: tableData } = props
  const history = useHistory()
  const loc = useLocation()
  const tableRef = React.useRef<MuiTableWithLangs>(null)
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)

  // REFACTOR: get this monster into utils or events or something
  const onRowClick = (
    event: React.MouseEvent,
    rowData: DetailsSchema
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

    if (field === 'id') {
      history.push(`${routes.details}/${rowData.id}`) // show feature in map

      return
    }

    // Don't set filter for image-only Endonyms
    if (field === 'Endonym' && rowData['Font Image Alt']) return

    if (field === 'Description') {
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

    const newlyFiltered = columns.map(
      (column: Types.ColumnWithTableData, i) => {
        let filterValue

        if (colIndex !== i) filterValue = column.tableData.filterValue
        // Lookup filter types have array values
        else if (column.lookup) filterValue = [newFilterVal]
        else filterValue = newFilterVal

        return {
          ...column,
          tableData: { ...column.tableData, filterValue },
        }
      }
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
          <DetailsPanel routeBase="table" id="details-modal" />
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
