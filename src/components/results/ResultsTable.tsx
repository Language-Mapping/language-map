/* eslint-disable operator-linebreak */
/* eslint-disable react/display-name */
import React, { FC, useContext, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import { Typography } from '@material-ui/core'
import { GoFile } from 'react-icons/go'
import { IoMdHelpCircle, IoMdCloseCircle } from 'react-icons/io'
import { TiThList } from 'react-icons/ti'
import { FaMapMarkedAlt } from 'react-icons/fa'

import { GlobalContext, SimpleDialog } from 'components'
import * as config from './config'
import { MuiTableWithDataMgr } from './types'
import { RecordDescription } from './RecordDescription'
// import { useWindowResize } from '../../utils' // TODO: rm if not using

const { icons, options, columns, localization } = config

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableTitleRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    titleIcon: {
      fontSize: '0.6em',
      color: theme.palette.grey[700],
      marginRight: theme.spacing(1),
      flexShrink: 0,
    },
    descripDialogPaper: {
      margin: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
    },
  })
)

// TODO: separate file
const Title: FC = () => {
  const classes = useStyles()

  return (
    <Typography variant="h4" className={classes.tableTitleRoot}>
      <TiThList className={classes.titleIcon} />
      Data
    </Typography>
  )
}

export const ResultsTable: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()
  const loc = useLocation()
  // const { height } = useWindowResize() // TODO: rm if not using
  const [descripModalText, setDescripModalText] = useState<string>('')
  const tableRef = React.useRef<MuiTableWithDataMgr>(null)

  // TODO: some kind of `useState` to set asc/desc and sort Neighborhoods
  // properly (blanks last, regardless of direction)

  // TODO: highlight selected feature in table
  return (
    <>
      {descripModalText && (
        <SimpleDialog
          open={descripModalText !== ''}
          onClose={(event, reason) => setDescripModalText('')}
          PaperProps={{
            className: classes.descripDialogPaper,
          }}
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
          maxBodyHeight: 'calc(100vh - 73px - 32px - 53px - 20px)',
        }}
        columns={columns}
        localization={localization}
        data={state.langFeatures}
        title={<Title />}
        onRowClick={(event, rowData) => {
          if (rowData) {
            history.push(`/details?id=${rowData.ID}`)
          }
        }}
        // TODO: rm if not using, but most likely use to set button state
        // onFilterChange={() =>
        //   // @ts-ignore
        //   tableRef.current && tableRef.current.onQueryChange()
        // }
        // TODO: rm if not using (not even sure what triggers it)
        // onQueryChange={(ok) => console.log(ok)}
        // TODO: all into config
        actions={[
          {
            icon: () => <IoMdCloseCircle />,
            tooltip: 'Clear filters',
            isFreeAction: true,
            onClick: () => null, // TODO: wire up
          },
          {
            icon: () => <FaMapMarkedAlt />,
            tooltip: 'Set filters',
            isFreeAction: true,
            onClick: () => {
              if (!tableRef || !tableRef.current) {
                return
              }

              dispatch({
                type: 'SET_LANG_FEAT_IDS',
                payload: tableRef.current.dataManager.filteredData.map(
                  (data) => data.ID
                ),
              })

              history.push(`/${loc.search}`)
            },
          },
          {
            icon: () => <IoMdHelpCircle />,
            tooltip: 'Glossary',
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
