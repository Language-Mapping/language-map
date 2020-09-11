import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MTableToolbar, MaterialTableProps } from 'material-table'
import { Button } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { RiFilterOffFill } from 'react-icons/ri'

import { GlobalContext, DialogCloseBtn } from 'components'
import { paths as routes } from 'components/config/routes'
import { ResultsTitle } from './ResultsTitle'
import { MuiTableWithLangs, CloseTableProps } from './types'
import { LangRecordSchema } from '../../context/types'

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
      [theme.breakpoints.up('sm')]: {
        gridColumnGap: '1em',
      },
      [theme.breakpoints.up('md')]: {
        padding: '1em',
        justifyContent: 'flex-start',
        gridTemplateColumns: 'auto auto auto 1fr',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"title buttons local searchAndActions"`,
      },
    },
    searchAndActions: {
      display: 'flex',
      gridArea: 'searchAndActions',
      '& [class^=MTableToolbar-actions]': { flexShrink: 0 },
      '& .MuiToolbar-root': {
        paddingLeft: 0,
        [theme.breakpoints.up('sm')]: {
          justifyContent: 'center',
          marginRight: 16, // keeps it away from "X" close btn
        },
      },
      [theme.breakpoints.only('xs')]: {
        '& .MuiFormControl-root': { flexBasis: 165 },
        '& .MuiToolbar-root': {
          paddingRight: 0,
        },
      },
      [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
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
      gridArea: 'local',
      justifyContent: 'center',
      // outline: 'solid gold 1px',
      '& svg': { fontSize: '1.2em' },
      [theme.breakpoints.up('md')]: {
        marginTop: 0,
        justifySelf: 'flex-end',
      },
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

type ResultsToolbarProps = MaterialTableProps<LangRecordSchema> & {
  tableRef: React.RefObject<MuiTableWithLangs>
} & CloseTableProps

export const ResultsToolbar: FC<ResultsToolbarProps> = (props) => {
  const { tableRef, closeTable } = props
  const { dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const history = useHistory()

  function mapFilterBtnClick(): void {
    if (!tableRef || !tableRef.current) return

    closeTable()

    dispatch({
      type: 'SET_LANG_FEAT_IDS',
      payload: tableRef.current.state.data.map(
        (data: LangRecordSchema) => data.ID
      ),
    })

    history.push(routes.home)
  }

  return (
    <div className={classes.resultsToolbarRoot}>
      <ResultsTitle />
      <div className={classes.searchAndActions}>
        <MTableToolbar {...props} />
        <DialogCloseBtn tooltip="Exit" onClose={closeTable} />
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
          Clear filters
        </Button>
      </div>
      <small className={`${classes.localIndicator} ${classes.localCommLegend}`}>
        <BiMapPin /> Local community data
      </small>
    </div>
  )
}
