import React, { FC, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { Dialog } from '@material-ui/core'

import { GlobalContext, DialogCloseBtn, SlideUp } from 'components'
import { useStyles } from './styles'
import { ResultsTable } from './ResultsTable'
import { LangRecordSchema } from '../../context/types'
import { paths as routes } from '../config/routes'

export const ResultsModal: FC = () => {
  const classes = useStyles()
  const { state } = useContext(GlobalContext)

  // Routing
  const history = useHistory()
  const loc = useLocation()
  const match = useRouteMatch('/table')

  const [tableData, setTableData] = useState<LangRecordSchema[]>([])
  const [oneAndDone, setOneAndDone] = useState<boolean>(false)
  const [lastLoc, setLastLoc] = useState()

  useEffect((): void => {
    if (oneAndDone || !state.langFeatures.length) return
    if (!oneAndDone) setOneAndDone(true)

    setTableData([...state.langFeatures])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.langFeatures])

  // CRED:
  // help.mouseflow.com/en/articles/4310818-tracking-url-changes-with-react
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // TODO: take some time, fix it
    if (!loc.pathname.includes(routes.table)) setLastLoc(loc)
  }, [loc])

  // Go back in history if route wasn't table-based, otherwise go home
  const handleClose = (): void => {
    history.push(lastLoc || '/')
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
