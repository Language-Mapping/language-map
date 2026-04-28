import React, { FC, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material'
import { BiMapPin } from 'react-icons/bi'
import { FaMap, FaFileCsv, FaFilePdf } from 'react-icons/fa'
import { GoSearch } from 'react-icons/go'
import { MdViewColumn } from 'react-icons/md'
import { RiFilterOffFill } from 'react-icons/ri'

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
      backgroundColor: theme.palette.background.paper,
      display: 'grid',
      alignItems: 'center',
      gridColumnGap: '0.75em',
      gridRowGap: '0.4em',
      gridTemplateAreas: `"title searchAndActions"
        "buttons buttons"
        "exports exports"
        "local local"`,
      gridTemplateColumns: 'auto 1fr',
      '& .MuiIconButton-root': { padding: 4 },
      [theme.breakpoints.up('md')]: {
        gridTemplateAreas: `"title buttons exports local searchAndActions"`,
        gridTemplateColumns: 'auto auto auto auto 1fr',
        gridTemplateRows: 'auto',
        padding: '0.75em 1em',
      },
    },
    searchAndActions: {
      display: 'flex',
      gridArea: 'searchAndActions',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
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
      textAlign: 'center',
      '& svg': { fontSize: '1.2em' },
      [theme.breakpoints.up('md')]: { justifySelf: 'flex-end' },
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
  const {
    clearBtnEnabled,
    setClearBtnEnabled,
    scrollToTop,
    visibleRows,
    globalFilter,
    setGlobalFilter,
    resetFilters,
    rowCount,
    columns,
    columnToggles,
  } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const navigate = useNavigate()
  const noResults = rowCount === 0

  function clearFiltersBtnClick(physicalClick?: boolean): void {
    resetFilters()

    if (!physicalClick) {
      dispatch({ type: 'CLEAR_FILTERS', payload: 0 })
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
    dispatch({
      type: 'SET_LANG_LAYER_FEATURES',
      payload: whittleLangFeats(visibleRows),
    })

    dispatch({ type: 'SET_FILTER_HAS_RUN' })

    const gangsAllHere = state.langFeatsLenCache === visibleRows.length

    dispatch({ type: 'CLEAR_FILTERS', payload: gangsAllHere ? 0 : 1 })

    navigate(routes.home)
  }

  return (
    <div className={classes.resultsToolbarRoot}>
      <ResultsTitle />
      <div className={classes.searchAndActions}>
        <TextField
          size="small"
          variant="standard"
          placeholder="Search…"
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value)
            setClearBtnEnabled(true)
            scrollToTop()
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GoSearch />
              </InputAdornment>
            ),
          }}
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
        <ColumnVisibilityMenu toggles={columnToggles} />
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
          onClick={() => exportCsv(columns, visibleRows)}
        >
          CSV
        </Button>
        <Button
          title="Download filtered results as PDF"
          color="secondary"
          variant="outlined"
          size="small"
          startIcon={<FaFilePdf />}
          onClick={() => exportPdf(columns, visibleRows)}
        >
          PDF
        </Button>
      </div>
      <small className={`${classes.localIndicator} ${classes.localCommLegend}`}>
        <BiMapPin /> Local community data
      </small>
    </div>
  )
}

const ColumnVisibilityMenu: FC<{ toggles: Types.ColumnToggle[] }> = (props) => {
  const { toggles } = props
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <>
      <Button
        title="Toggle column visibility"
        color="secondary"
        variant="outlined"
        size="small"
        startIcon={<MdViewColumn />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Columns
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {toggles
          .filter((t) => t.canHide)
          .map((t) => (
            <MenuItem
              key={t.id}
              dense
              onClick={() => t.toggle()}
              sx={{ paddingY: 0 }}
            >
              <FormControlLabel
                onClick={(e) => e.preventDefault()}
                control={
                  <Checkbox
                    size="small"
                    color="secondary"
                    checked={t.isVisible}
                  />
                }
                label={t.label}
              />
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
