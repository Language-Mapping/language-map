import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MTableToolbar } from 'material-table'
import { Button } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { FaMap } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { GlobalContext } from 'components/context'
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
      borderBottom: `solid ${theme.palette.divider} 2px`,
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.background.paper,
      zIndex: 11, // keeps it above header row
      display: 'grid',
      alignItems: 'center',
      gridColumnGap: '0.75em',
      gridRowGap: '0.15em',
      gridTemplateAreas: `"title searchAndActions"
        "buttons buttons"
        "local local"`,
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto auto auto',
      // marginBottom: '0.25em', // STUPID SPACER SO RIDICULOUS
      '& .MuiIconButton-root': { padding: 4 }, // huuuge by default
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'auto auto',
        justifyContent: 'center',
        gridColumnGap: '1em',
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateAreas: `"title buttons local searchAndActions"`,
        gridTemplateColumns: 'auto auto auto 1fr',
        gridTemplateRows: 'auto',
        justifyContent: 'flex-start',
        padding: '1em 1em 0',
        height: 100, // ugghhhhh
      },
    },
    // TODO: move the stupid searchbar onto its own line
    searchAndActions: {
      display: 'flex',
      gridArea: 'searchAndActions',
      '& .MuiToolbar-root': { paddingLeft: 0 },
      // Can't seem to access these any other way except maybe overriding the
      // entire component, and definitely not via `MTable` classes since they
      // are mutated in the build.
      '& .MuiToolbar-root > :nth-child(2)': { display: 'none' }, // spacer
      '& .MuiToolbar-root > :last-child': { flexShrink: 0 }, // actions wrap
      [theme.breakpoints.only('xs')]: {
        '& .MuiToolbar-root': { paddingRight: 0 },
        '& .MuiInputBase-root.MuiInput-root': { maxWidth: 135 }, // so FRAGILE
      },
      [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
        marginRight: 8,
      },
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
  })
)

export const ResultsToolbar: FC<Types.ResultsToolbarProps> = (props) => {
  const { tableRef, clearBtnEnabled, setClearBtnEnabled, scrollToTop } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()
  const noResults = tableRef.current && !tableRef.current.state.data.length

  useEffect((): void => {
    // TODO: fix, obviously:
    if (state.clearFilters === 555) {
      clearFiltersBtnClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.clearFilters])

  function mapFilterBtnClick(): void {
    if (!tableRef?.current) return

    const currentData = tableRef.current.state.data

    dispatch({
      type: 'SET_LANG_LAYER_FEATURES',
      payload: currentData,
    })

    const gangsAllHere = state.langFeatsLenCache === currentData.length

    dispatch({
      type: 'CLEAR_FILTERS',
      payload: gangsAllHere ? 0 : 1,
    })

    history.push(routes.home)
  }

  // CRED: 🎉
  // https://github.com/mbrn/material-table/issues/1132#issuecomment-549591832
  function clearFiltersBtnClick(physicalClick?: boolean): void {
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

    setClearBtnEnabled(false)
    scrollToTop()

    if (!physicalClick) {
      dispatch({
        type: 'CLEAR_FILTERS',
        payload: 0,
      })

      dispatch({
        type: 'SET_LANG_LAYER_FEATURES',
        payload: dataManager.data,
      })
    }
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
          title="Set table filters and return to map"
          color="secondary"
          variant="contained"
          size="small"
          startIcon={<FaMap />}
          onClick={() => mapFilterBtnClick()}
          disabled={noResults}
        >
          View results in map
        </Button>
        <Button
          title="Clear table filters"
          color="secondary"
          variant="contained"
          disabled={!clearBtnEnabled}
          size="small"
          startIcon={<RiFilterOffFill />}
          onClick={() => clearFiltersBtnClick(true)}
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
