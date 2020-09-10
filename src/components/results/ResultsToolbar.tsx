import React, { FC, useContext } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MTableToolbar, MaterialTableProps } from 'material-table'
import { Button } from '@material-ui/core'
import { FaMapMarkerAlt, FaMapMarkedAlt } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'
import { ResultsTitle } from './ResultsTitle'
import { MuiTableWithDataMgr } from './types'
import { LangRecordSchema } from '../../context/types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsToolbarRoot: {
      padding: '0.5em 0.75em',
      // outline: 'solid blue 5px',
      position: 'sticky',
      top: 0,
      zIndex: 11, // keeps it above header row
      display: 'grid',
      alignItems: 'center',
      gridColumnGap: '0.75em',
      marginBottom: '0.25em',
      '& .MuiIconButton-root': {
        padding: 4,
        [theme.breakpoints.up('sm')]: {
          padding: 8,
        },
      },
      [theme.breakpoints.up('sm')]: {
        padding: '1em',
        justifyContent: 'flex-start',
        gridTemplateColumns: 'auto auto auto',
      },
    },
    resultsTitleWrap: {
      display: 'flex',
      '& [class^=MTableToolbar-actions]': { flexShrink: 0 },
      '& .MuiToolbar-root': { flexBasis: '70%' },
      [theme.breakpoints.down('sm')]: {
        '& .MuiToolbar-regular': {
          paddingLeft: '0.5em',
        },
      },
      // outline: 'solid red 1px',
    },
    localIndicator: {
      display: 'flex',
      alignItems: 'center',
      '& svg': { color: theme.palette.primary.main, marginRight: 4 },
    },
    subtleText: {
      color: theme.palette.text.secondary,
      textAlign: 'center',
      display: 'flex',
      marginTop: '0.4em',
      fontSize: '0.75em',
      justifyContent: 'center',
      // outline: 'solid gold 1px',
      [theme.breakpoints.up('sm')]: {
        marginTop: 0,
        justifySelf: 'flex-end',
      },
    },
    toolbarBtns: {
      alignItems: 'center',
      display: 'grid',
      gridColumnGap: '0.75em',
      gridTemplateColumns: 'auto auto',
      justifyContent: 'center',
      // outline: 'solid green 1px',
    },
  })
)

type ResultsToolbarProps = MaterialTableProps<LangRecordSchema> & {
  mapFiltersBtnDisabled: boolean
  tableRef: React.RefObject<MuiTableWithDataMgr>
}

export const ResultsToolbar: FC<ResultsToolbarProps> = (props) => {
  const { tableRef, mapFiltersBtnDisabled } = props
  const { dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()
  const loc = useLocation()

  function mapFilterBtnClick(): void {
    if (!tableRef || !tableRef.current) return

    // TODO: pick one or the other, not both
    dispatch({
      type: 'SET_LANG_FEAT_IDS',
      payload: tableRef.current.dataManager.filteredData.map(
        (data: LangRecordSchema) => data.ID
      ),
    })

    history.push(routes.home)
  }

  return (
    <div className={classes.resultsToolbarRoot}>
      <div className={classes.resultsTitleWrap}>
        <ResultsTitle />
        <MTableToolbar {...props} />
      </div>
      <div className={classes.toolbarBtns}>
        <Button
          title="Set table filters and return to map"
          color="secondary"
          variant="contained"
          disabled={mapFiltersBtnDisabled}
          size="small"
          startIcon={<FaMapMarkedAlt />}
          onClick={() => mapFilterBtnClick()}
        >
          Map Filtered Data
        </Button>
        <Button
          title="Clear table filters"
          color="secondary"
          variant="contained"
          disabled // TODO: disable if no filters
          size="small"
          startIcon={<RiFilterOffFill />}
        >
          Clear all
        </Button>
      </div>
      <small className={`${classes.localIndicator} ${classes.subtleText}`}>
        <FaMapMarkerAlt /> Local community data&nbsp;&nbsp;
        {/* <RouterLink to={routes.glossary + loc.search}>What's this?</RouterLink> */}
        <RouterLink to={routes.glossary + loc.search}>
          Help and glossary
        </RouterLink>
      </small>
    </div>
  )
}
