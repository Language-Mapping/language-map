import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MTableToolbar, MaterialTableProps } from 'material-table'
import { Button } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'
import { ResultsTitle } from './ResultsTitle'
import { MuiTableWithDataMgr, CloseTableProps } from './types'
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
      '& .MuiToolbar-root': { flexBasis: '100%' },
      [theme.breakpoints.down('sm')]: {
        '& .MuiToolbar-regular': {
          paddingLeft: '0.5em',
          paddingRight: 0,
        },
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
      textAlign: 'center',
      display: 'flex',
      marginTop: '0.4em',
      fontSize: '0.75em',
      justifyContent: 'center',
      // outline: 'solid gold 1px',
      '& svg': { fontSize: '1.2em' },
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
    toolbarBtn: {
      textTransform: 'none',
    },
  })
)

type ResultsToolbarProps = MaterialTableProps<LangRecordSchema> & {
  tableRef: React.RefObject<MuiTableWithDataMgr>
} & CloseTableProps

export const ResultsToolbar: FC<ResultsToolbarProps> = (props) => {
  const { tableRef, closeTable } = props
  const { dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()

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
    closeTable()
  }

  return (
    <div className={classes.resultsToolbarRoot}>
      <div className={classes.resultsTitleWrap}>
        <ResultsTitle />
        <MTableToolbar {...props} />
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
          disabled // TODO: disable if no filters
          size="small"
          startIcon={<RiFilterOffFill />}
        >
          Clear all
        </Button>
      </div>
      <small className={`${classes.localIndicator} ${classes.localCommLegend}`}>
        <BiMapPin /> Local community data
      </small>
    </div>
  )
}
