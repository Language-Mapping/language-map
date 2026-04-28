import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Button } from '@mui/material'
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  gridFilteredSortedRowEntriesSelector,
  useGridApiContext,
} from '@mui/x-data-grid'
import { BiMapPin } from 'react-icons/bi'
import { FaMap, FaFileCsv, FaFilePdf } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { InstanceLevelSchema } from 'components/context/types'
import { GlobalContext } from 'components/context'
import { routes } from 'components/config/api'
import { PopoverWithUItext } from 'components/generic'
import { ResultsTitle } from './ResultsTitle'

import * as Types from './types'
import { exportCsv, exportPdf } from './exporting'
import { whittleLangFeats } from './utils'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsToolbarRoot: {
      padding: '0.5em 0.75em',
      borderBottom: `solid ${theme.palette.divider} 2px`,
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.background.paper,
      zIndex: 11,
      display: 'grid',
      alignItems: 'center',
      gridColumnGap: '0.75em',
      gridRowGap: '0.4em',
      gridTemplateAreas: `"title searchAndActions"
        "buttons buttons"
        "exports exports"
        "local local"`,
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto auto auto auto',
      '& .MuiIconButton-root': { padding: 4 },
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'auto auto',
        justifyContent: 'center',
        gridColumnGap: '1em',
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateAreas: `"title buttons exports local searchAndActions"`,
        gridTemplateColumns: 'auto auto auto auto 1fr',
        gridTemplateRows: 'auto',
        justifyContent: 'flex-start',
        padding: '0.75em 1em 0',
        height: 'auto',
      },
    },
    searchAndActions: {
      display: 'flex',
      gridArea: 'searchAndActions',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
        marginRight: 8,
      },
    },
    localIndicator: {
      display: 'flex',
      alignItems: 'center',
      '& svg': { color: theme.palette.secondary.light, marginRight: 4 },
    },
    localCommLegend: {
      color: theme.palette.text.secondary,
      display: 'flex',
      fontSize: '0.75em',
      gridArea: 'local',
      justifyContent: 'center',
      marginTop: '0.4em',
      textAlign: 'center',
      '& svg': { fontSize: '1.2em' },
      [theme.breakpoints.up('md')]: { marginTop: 0, justifySelf: 'flex-end' },
    },
    toolbarBtns: {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      gridArea: 'buttons',
      justifyContent: 'center',
    },
    exportBtns: {
      alignItems: 'center',
      display: 'flex',
      gap: '0.5rem',
      gridArea: 'exports',
      justifyContent: 'center',
    },
  })
)

export const ResultsToolbar: FC<Types.ResultsToolbarProps> = (props) => {
  const { clearBtnEnabled, setClearBtnEnabled, scrollToTop, columns } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()
  const apiRef = useGridApiContext()

  const rowCount = apiRef.current.getRowsCount()
  const noResults = rowCount === 0

  const getVisibleRows = (): InstanceLevelSchema[] =>
    gridFilteredSortedRowEntriesSelector(apiRef).map(
      (entry) => entry.model as InstanceLevelSchema
    )

  function clearFiltersBtnClick(physicalClick?: boolean): void {
    apiRef.current.setFilterModel({ items: [] })
    apiRef.current.setQuickFilterValues([])
    setClearBtnEnabled(false)
    scrollToTop()

    if (!physicalClick) {
      dispatch({ type: 'CLEAR_FILTERS', payload: 0 })
      dispatch({
        type: 'SET_LANG_LAYER_FEATURES',
        payload: whittleLangFeats(getVisibleRows()),
      })
    }
  }

  useEffect((): void => {
    if (state.clearFilters === 555) {
      clearFiltersBtnClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.clearFilters])

  function mapFilterBtnClick(): void {
    const visibleRows = getVisibleRows()

    dispatch({
      type: 'SET_LANG_LAYER_FEATURES',
      payload: whittleLangFeats(visibleRows),
    })

    dispatch({ type: 'SET_FILTER_HAS_RUN' })

    const gangsAllHere = state.langFeatsLenCache === visibleRows.length

    dispatch({ type: 'CLEAR_FILTERS', payload: gangsAllHere ? 0 : 1 })

    history.push(routes.home)
  }

  return (
    <GridToolbarContainer className={classes.resultsToolbarRoot}>
      <ResultsTitle />
      <div className={classes.searchAndActions}>
        <GridToolbarQuickFilter
          variant="standard"
          placeholder="Search…"
          onChange={() => setClearBtnEnabled(true)}
        />
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
          View in map
        </Button>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <Button
          title="Clear table filters"
          color="secondary"
          variant="outlined"
          disabled={!clearBtnEnabled}
          size="small"
          startIcon={<RiFilterOffFill />}
          onClick={() => clearFiltersBtnClick(true)}
        >
          Clear
        </Button>
        <PopoverWithUItext id="table-info-btn" />
      </div>
      <div className={classes.exportBtns}>
        <Button
          title="Download filtered results as CSV"
          color="secondary"
          variant="outlined"
          size="small"
          startIcon={<FaFileCsv />}
          onClick={() => exportCsv(columns, getVisibleRows())}
        >
          CSV
        </Button>
        <Button
          title="Download filtered results as PDF"
          color="secondary"
          variant="outlined"
          size="small"
          startIcon={<FaFilePdf />}
          onClick={() => exportPdf(columns, getVisibleRows())}
        >
          PDF
        </Button>
      </div>
      <small className={`${classes.localIndicator} ${classes.localCommLegend}`}>
        <BiMapPin /> Local community data
      </small>
    </GridToolbarContainer>
  )
}
