/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { SimpleDialog, LangOrEndoIntro, LangOrEndoProps } from 'components'
import { paths as routes } from 'components/config/routes'
import { MuiTableWithLangs } from './types'
import { ResultsToolbar } from './ResultsToolbar'
import { RecordDescription } from './RecordDescription'
import { LangRecordSchema } from '../../context/types'
// import { useWindowResize } from '../../utils' // TODO: rm if not using

import * as Types from './types'
import * as config from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Smaller than the default so that it is not as large as table modal
    descripDialogPaper: {
      margin: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
    },
  })
)

export const ResultsTable: FC<Types.ResultsTableProps> = (props) => {
  const { closeTable, data: tableData } = props
  const classes = useStyles()
  const history = useHistory()
  const loc = useLocation()
  const tableRef = React.useRef<MuiTableWithLangs>(null)
  // const { height } = useWindowResize() // TODO: rm if not using
  const [descripModalText, setDescripModalText] = useState<string>('')
  const [clearBtnEnabled, setClearBtnEnabled] = useState<boolean>(false)
  const [descripModalHeading, setDescripModalHeading] = useState<
    LangOrEndoProps
  >()

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
    const newFilterVal = rowData ? rowData[field] : ''

    // Show feature in map
    if (field === 'ID') {
      history.push(`${routes.details}?id=${rowData.ID}`)
      closeTable()

      return
    }

    // Don't set filter for image-only Endonyms
    if (field === 'Endonym' && rowData['Font Image Alt']) return

    // Open description modal
    if (field === 'Description') {
      setDescripModalText(rowData.Description)
      setDescripModalHeading({ attribs: rowData })

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
  }

  return (
    <>
      {descripModalText && (
        <SimpleDialog
          open={descripModalText !== ''}
          onClose={() => setDescripModalText('')}
          PaperProps={{ className: classes.descripDialogPaper }}
        >
          {descripModalHeading && (
            <div style={{ textAlign: 'center' }}>
              <LangOrEndoIntro attribs={descripModalHeading.attribs} />
            </div>
          )}
          <RecordDescription text={descripModalText} />
        </SimpleDialog>
      )}
      <MaterialTable
        icons={config.icons}
        tableRef={tableRef}
        // maxBodyHeight: height - 120, // TODO: something
        options={{ ...config.options }}
        columns={config.columns}
        localization={config.localization}
        data={tableData}
        onRowClick={(event, rowData): void => {
          if (!tableRef || !tableRef.current || !event || !rowData) return

          onRowClick(event, rowData)
        }}
        components={{
          Toolbar: (toolbarProps) => (
            <ResultsToolbar
              {...toolbarProps}
              closeTable={closeTable}
              setClearBtnEnabled={setClearBtnEnabled}
              tableRef={tableRef}
              clearBtnEnabled={clearBtnEnabled}
            />
          ),
        }}
        // Works but laggy:
        onFilterChange={(filters) => setClearBtnEnabled(true)}
        // CANNOT get this to work without setting the focus to the clear btn
        // onSearchChange={(search) => setClearBtnEnabled(true)}
        // TODO: all into config
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
