/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import MaterialTable from 'material-table'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { SimpleDialog } from 'components'
import { paths as routes } from 'components/config/routes'
import { DetailsPanel } from 'components/details'
import { MuiTableWithLangs } from './types'
import { ResultsToolbar } from './ResultsToolbar'
import { LangRecordSchema } from '../../context/types'

import * as Types from './types'
import * as config from './config'

export const ResultsTable: FC<Types.ResultsTableProps> = (props) => {
  const { closeTable, data: tableData } = props
  const history = useHistory()
  const loc = useLocation()
  const tableRef = React.useRef<MuiTableWithLangs>(null)
  const [detailsModalContent, setDetailsModalContent] = useState<
    LangRecordSchema | undefined
  >()
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)

  // TODO: some kind of `useState` to set asc/desc and sort Neighborhoods
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
    if (field === 'ID') {
      history.push(`${routes.details}?id=${rowData.ID}`)
      closeTable()

      return
    }

    // Don't set filter for image-only Endonyms
    if (field === 'Endonym' && rowData['Font Image Alt']) return

    // Open Details modal
    if (field === 'Description') {
      setDetailsModalContent(rowData)

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

    self.setState({
      ...dataManager.getRenderState(),
      columns: newlyFiltered,
    })

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
      <SimpleDialog
        open={detailsModalContent !== undefined}
        onClose={() => setDetailsModalContent(undefined)}
      >
        <DetailsPanel skipSelFeatCheck attribsDirect={detailsModalContent} />
      </SimpleDialog>
      <MaterialTable
        icons={config.icons}
        tableRef={tableRef}
        options={{ ...config.options }}
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
                closeTable,
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
            onClick: () => history.push(`/help${loc.search}`),
          },
        ]}
      />
    </>
  )
}
