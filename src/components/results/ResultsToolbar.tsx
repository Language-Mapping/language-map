import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Button } from '@mui/material'
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  gridFilteredSortedRowEntriesSelector,
  useGridApiContext,
} from '@mui/x-data-grid'

import { InstanceLevelSchema } from 'components/context/types'
import { BiMapPin } from 'react-icons/bi'
import { FaMap } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { GlobalContext } from 'components/context'
import { routes } from 'components/config/api'
import { PopoverWithUItext } from 'components/generic'
import { ResultsTitle } from './ResultsTitle'

import * as Types from './types'
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
      gridRowGap: '0.15em',
      gridTemplateAreas: `"title searchAndActions"
        "buttons buttons"
        "local local"`,
      gridTemplateColumns: 'auto 1fr',
      gridTemplateRows: 'auto auto auto',
      '& .MuiIconButton-root': { padding: 4 },
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
        height: 100,
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
      display: 'grid',
      gridArea: 'buttons',
      gridColumnGap: '0.5rem',
      gridTemplateColumns: 'auto auto auto',
      justifyContent: 'center',
      [theme.breakpoints.only('xs')]: {
        gridColumnGap: '0.25rem',
      },
    },
  })
)

export const ResultsToolbar: FC<Types.ResultsToolbarProps> = (props) => {
  const { clearBtnEnabled, setClearBtnEnabled, scrollToTop } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()
  const apiRef = useGridApiContext()

  const rowCount = apiRef.current.getRowsCount()
  const noResults = rowCount === 0

  function clearFiltersBtnClick(physicalClick?: boolean): void {
    apiRef.current.setFilterModel({ items: [] })
    apiRef.current.setQuickFilterValues([])
    setClearBtnEnabled(false)
    scrollToTop()

    if (!physicalClick) {
      dispatch({ type: 'CLEAR_FILTERS', payload: 0 })
      const visibleRows = gridFilteredSortedRowEntriesSelector(apiRef).map(
        (entry) => entry.model as InstanceLevelSchema
      )
      dispatch({
        type: 'SET_LANG_LAYER_FEATURES',
        payload: whittleLangFeats(visibleRows),
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
    const visibleRows = gridFilteredSortedRowEntriesSelector(apiRef).map(
      (entry) => entry.model as InstanceLevelSchema
    )

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
        <PopoverWithUItext id="table-info-btn" />
      </div>
      <small className={`${classes.localIndicator} ${classes.localCommLegend}`}>
        <BiMapPin /> Local community data
      </small>
    </GridToolbarContainer>
  )
}
