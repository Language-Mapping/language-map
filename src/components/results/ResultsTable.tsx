/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { GoFile } from 'react-icons/go'

import { GlobalContext, SimpleDialog } from 'components'
import { paths as routes } from 'components/config/routes'
import * as config from './config'
import { MuiTableWithDataMgr } from './types'
import { ResultsToolbar } from './ResultsToolbar'
import { ResultsTitle } from './ResultsTitle'
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

export const ResultsTable: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()
  // const { height } = useWindowResize() // TODO: rm if not using
  const [descripModalText, setDescripModalText] = useState<string>('')
  const [mapFiltersBtnDisabled, setMapFiltersBtnDisbled] = useState<boolean>(
    true
  )
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
          // maxBodyHeight: height - 138, // TODO: more exact for mobile and desk
          // maxBodyHeight: height - 120, // TODO: more exact for mobile and desk
          // maxBodyHeight: 'calc(100vh - 73px - 32px - 53px - 20px)',
        }}
        columns={columns}
        localization={localization}
        data={state.langFeatures}
        title={<ResultsTitle />}
        onRowClick={(event, rowData) => {
          if (rowData) history.push(`${routes.details}?id=${rowData.ID}`)
        }}
        components={{
          Toolbar: (props) => (
            <ResultsToolbar
              {...props}
              mapFiltersBtnDisabled={mapFiltersBtnDisabled}
              tableRef={tableRef}
            />
          ),
        }}
        onFilterChange={() => setMapFiltersBtnDisbled(false)}
        // TODO: rm if not using (not even sure what triggers it)
        // onQueryChange={() => setMapFiltersBtnDisbled(false)}
        // TODO: all into config
        actions={[
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
