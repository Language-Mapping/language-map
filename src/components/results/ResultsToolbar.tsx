import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MTableToolbar } from 'material-table'
import { Button } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'
import { ResultsTitle } from './ResultsTitle'

import * as Types from './types'

const TOOLBAR_ID = 'custom-toolbar'

// TODO: get this monster into styles file
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsToolbarRoot: {
      padding: '0.5em 0.75em',
      // outline: 'solid blue 5px',
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.background.paper,
      zIndex: 11, // keeps it above header row
      display: 'grid',
      alignItems: 'center',
      gridColumnGap: '0.75em',
      gridRowGap: '0.15em',
      marginBottom: '0.25em',
      gridTemplateAreas: `"title searchAndActions"
        "buttons buttons"
        "local local"`,
      gridTemplateColumns: 'auto auto',
      gridTemplateRows: 'auto auto auto',
      justifyContent: 'center',
      '& .MuiIconButton-root': { padding: 4 }, // huuuge by default
      [theme.breakpoints.up('sm')]: { gridColumnGap: '1em' },
      [theme.breakpoints.up('md')]: {
        gridTemplateAreas: `"title buttons local searchAndActions"`,
        gridTemplateColumns: 'auto auto auto 1fr',
        gridTemplateRows: 'auto',
        justifyContent: 'flex-start',
        padding: '1em',
      },
    },
    searchAndActions: {
      display: 'flex',
      gridArea: 'searchAndActions',
      '& [class^=MTableToolbar-actions]': { flexShrink: 0 },
      '& .MuiToolbar-root': { paddingLeft: 0 },
      [theme.breakpoints.only('xs')]: {
        '& .MuiToolbar-root': { paddingRight: 0 },
      },
      [theme.breakpoints.up('md')]: { justifyContent: 'flex-end' },
      // outline: 'solid red 1px',
    },
    localIndicator: {
      display: 'flex',
      alignItems: 'center',
      '& svg': { color: theme.palette.primary.main, marginRight: 4 },
    },
    localCommLegend: {
      color: theme.palette.text.secondary,
      display: 'flex',
      fontSize: '0.75em',
      gridArea: 'local',
      justifyContent: 'center',
      marginTop: '0.4em',
      textAlign: 'center',
      // outline: 'solid gold 1px',
      '& svg': { fontSize: '1.2em' },
      [theme.breakpoints.up('md')]: { marginTop: 0, justifySelf: 'flex-end' },
    },
    toolbarBtns: {
      alignItems: 'center',
      display: 'grid',
      gridArea: 'buttons',
      gridColumnGap: '0.5em',
      gridTemplateColumns: 'auto auto',
      justifyContent: 'center',
      // outline: 'solid green 1px',
    },
    toolbarBtn: {
      textTransform: 'none',
    },
  })
)

export const ResultsToolbar: FC<Types.ResultsToolbarProps> = (props) => {
  const { tableRef, closeTable } = props
  const { dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()

  function mapFilterBtnClick(): void {
    if (!tableRef || !tableRef.current) return

    closeTable()

    dispatch({
      type: 'SET_LANG_LAYER_FEATURES',
      payload: tableRef.current.state.data,
    })

    history.push(routes.home)
  }

  // CRED: 🎉
  // https://github.com/mbrn/material-table/issues/1132#issuecomment-549591832
  function clearFiltersBtnClick(): void {
    if (!tableRef || !tableRef.current) return

    const self = tableRef.current
    const { dataManager } = self
    const { columns } = dataManager.getRenderState()

    // CRED: for TS: https://stackoverflow.com/a/46204035/1048518
    const shame: HTMLElement = document.querySelector(
      `#${TOOLBAR_ID} button[aria-label="Clear Search"]`
    ) as HTMLElement

    if (shame) shame.click()
    // else { // TODO: sentry: element not found... }

    const cleared = columns.map((column: Types.ColumnWithTableData) => ({
      ...column,
      tableData: { ...column.tableData, filterValue: undefined },
    }))

    columns.forEach((col: Types.ColumnWithTableData, i: number) => {
      dataManager.changeFilterValue(i, undefined)
    })

    self.setState({ ...dataManager.getRenderState(), columns: cleared })
  }

  return (
    <div className={classes.resultsToolbarRoot}>
      <ResultsTitle />
      <div className={classes.searchAndActions} id={TOOLBAR_ID}>
        <MTableToolbar {...props} />
        {/* TODO: restore */}
        {/* Showing {langFeatures.length} of {langFeatures.length} communities. */}
      </div>
      <div className={classes.toolbarBtns}>
        <Button
          className={classes.toolbarBtn}
          title="Set table filters and return to map"
          color="secondary"
          variant="contained"
          size="small"
          startIcon={<FaMapMarkedAlt />}
          onClick={() => mapFilterBtnClick()}
        >
          View results in map
        </Button>
        <Button
          className={classes.toolbarBtn}
          title="Clear table filters"
          color="secondary"
          variant="contained"
          // disabled // TODO: disable if no filters
          size="small"
          startIcon={<RiFilterOffFill />}
          onClick={() => clearFiltersBtnClick()}
        >
          Clear filters
        </Button>
      </div>
      <small className={`${classes.localIndicator} ${classes.localCommLegend}`}>
        <BiMapPin /> Local community data
      </small>
    </div>
  )
}
