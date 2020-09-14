/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { GoFile } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { SimpleDialog, LangOrEndoIntro, LangOrEndoProps } from 'components'
import { paths as routes } from 'components/config/routes'
import { MuiTableWithLangs } from './types'
import { ResultsToolbar } from './ResultsToolbar'
import { RecordDescription } from './RecordDescription'
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
        onRowClick={(event, rowData) => {
          if (rowData) {
            history.push(`${routes.details}?id=${rowData.ID}`)
            closeTable()
          }
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
            onClick: () => history.push(`/glossary${loc.search}`),
          },
          (data) => ({
            icon: () => <GoFile />,
            tooltip: !data.Description
              ? 'No description available'
              : 'View description',
            onClick: (event, clickedRowData) => {
              let record

              if (Array.isArray(clickedRowData)) {
                ;[record] = clickedRowData
              } else {
                record = clickedRowData
              }

              setDescripModalText(record.Description)
              setDescripModalHeading({ attribs: record })
            },
            iconProps: {
              color: data.Description === '' ? 'disabled' : 'primary',
            },
            disabled: data.Description === '',
          }),
        ]}
      />
    </>
  )
}
