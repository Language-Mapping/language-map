/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { GoFile } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { SimpleDialog } from 'components'
import { paths as routes } from 'components/config/routes'
import { MuiTableWithDataMgr } from './types'
import { ResultsToolbar } from './ResultsToolbar'

import * as Types from './types'
import * as config from './config'

import { RecordDescription } from './RecordDescription'
// import { useWindowResize } from '../../utils' // TODO: rm if not using

const { icons, options, columns, localization } = config

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
  // const { height } = useWindowResize() // TODO: rm if not using
  const [descripModalText, setDescripModalText] = useState<string>('')
  const tableRef = React.useRef<MuiTableWithDataMgr>(null)

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
          <RecordDescription text={descripModalText} />
        </SimpleDialog>
      )}
      <MaterialTable
        icons={icons}
        tableRef={tableRef}
        options={{
          ...options,
          // maxBodyHeight: height - 120, // TODO: something if still bad scroll
        }}
        columns={columns}
        localization={localization}
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
              tableRef={tableRef}
            />
          ),
        }}
        // onFilterChange={() => setMapFiltersBtnDisbled(false)} // TODO: this
        // TODO: rm if not using (not even sure what triggers it)
        // onQueryChange={() => setMapFiltersBtnDisbled(false)}
        // TODO: all into config
        actions={[
          {
            icon: () => <AiOutlineQuestionCircle />,
            tooltip: 'Help and glossary',
            isFreeAction: true,
            onClick: () => history.push(`/glossary${loc.search}`),
          },
          (data) => ({
            icon: () => <GoFile />,
            tooltip: !data.Description
              ? 'No description available'
              : 'View description',
            onClick: (event, clickedRowData) => {
              let text = ''

              if (Array.isArray(clickedRowData)) {
                text = clickedRowData[0].Description
              } else {
                text = clickedRowData.Description
              }

              setDescripModalText(text)
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
