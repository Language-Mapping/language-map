import React, { FC, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { Dialog } from '@material-ui/core'

import { GlobalContext, DialogCloseBtn, SlideUp } from 'components'
import { useStyles } from './styles'
import { ResultsTable } from './ResultsTable'
import { LangRecordSchema } from '../../context/types'

type HistoryState = {
  pathname: string
  selFeatID?: number
}

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

  const handleClose = (): void => {
    const historyState = loc.state as HistoryState

    if (historyState && historyState.pathname) {
      history.push(historyState)
    } else if (history.length) {
      history.goBack()
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
      maxWidth="lg"
      PaperProps={{ className: classes.resultsModalPaper }}
    >
      <DialogCloseBtn onClose={handleClose} tooltip="Exit to map" />
      <ResultsTable closeTable={handleClose} data={tableData} />
    </Dialog>
  )
}
