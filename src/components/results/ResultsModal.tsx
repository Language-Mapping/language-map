import React, { FC, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { Dialog } from '@material-ui/core'

import { GlobalContext, DialogCloseBtn, SlideUp } from 'components'
import * as Types from './types'
import { useStyles } from './styles'
import { ResultsTable } from './ResultsTable'
import { LangRecordSchema } from '../../context/types'

export const ResultsModal: FC = () => {
  const classes = useStyles()
  const { state } = useContext(GlobalContext)

  // Routing
  const history = useHistory()
  const loc = useLocation()
  const match = useRouteMatch('/table')

  const [tableData, setTableData] = useState<LangRecordSchema[]>([])
  const [oneAndDone, setOneAndDone] = useState<boolean>(false)

  useEffect((): void => {
    if (oneAndDone || !state.langFeatures.length) return
    if (!oneAndDone) setOneAndDone(true)

    setTableData([...state.langFeatures])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.langFeatures])

  // Go back in history if there is one as long as last route wasn't table-based
  const handleClose = (): void => {
    const historyState = loc.state as Types.HistoryState

    if (historyState.pathname?.includes('/table')) {
      history.push('/')
    } else if (history.length) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <Dialog
      open={match !== null}
      keepMounted
      TransitionComponent={SlideUp}
      className={`${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="xl"
      PaperProps={{ className: classes.resultsModalPaper }}
    >
      <DialogCloseBtn onClose={handleClose} tooltip="Exit to map" />
      <ResultsTable data={tableData} />
    </Dialog>
  )
}
