import React, { FC, useContext } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MTableToolbar, MaterialTableProps } from 'material-table'
import { Button, Typography } from '@material-ui/core'
import { IoMdCloseCircle } from 'react-icons/io'
import { FaMapMarkerAlt } from 'react-icons/fa'

import { GlobalContext } from 'components'
import { paths as routes } from 'components/config/routes'
import { MuiTableWithDataMgr } from './types'
import { LangRecordSchema } from '../../context/types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsToolbarRoot: {
      paddingLeft: '1em',
      paddingRight: '1em',
      position: 'sticky',
      top: 0,
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      // flexDirection: 'column',
    },
    localIndicator: {
      display: 'flex',
      alignItems: 'center',
      '& svg': { color: theme.palette.primary.main, marginRight: 4 },
    },
    toolbarBtns: {
      display: 'flex',
      margin: '0.8em 0',
      // '& > * + *': { marginLeft: '0.5em' },
      justifyContent: 'space-evenly',
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
    <>
      <MTableToolbar {...props} />
      <div className={classes.resultsToolbarRoot}>
        <Typography variant="h5">Filters</Typography>
        <div className={classes.toolbarBtns}>
          <Button
            title="Clear table filters"
            color="secondary"
            variant="contained"
            disabled // TODO: disable if no filters
            size="small"
            startIcon={<IoMdCloseCircle />}
          >
            Clear
          </Button>
          <Button
            title="Set table filters and return to map"
            color="secondary"
            variant="contained"
            disabled={mapFiltersBtnDisabled}
            size="small"
            startIcon={<FaMapMarkerAlt />}
            onClick={() => mapFilterBtnClick()}
          >
            Set in map
          </Button>
        </div>
        <small>
          Stuff here affects the map.{' '}
          <RouterLink to={routes.glossary + loc.search}>
            Learn 'bout these fields.
          </RouterLink>
        </small>
        <small className={classes.localIndicator}>
          <FaMapMarkerAlt /> Local community attribute
        </small>
      </div>
    </>
  )
}
