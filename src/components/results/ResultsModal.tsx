import React, { FC, useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { Dialog } from '@material-ui/core'

import { DialogCloseBtn, SlideUp } from 'components/generic/modals'
import { useStyles } from './styles'
import { ResultsTable } from './ResultsTable'
import { paths as routes } from '../config/routes'
import { LocWithState } from '../config/types'
import { useFullData } from './hooks'

const ResultsModal: FC = () => {
  const classes = useStyles()

  // Routing
  const history = useHistory()
  const loc = useLocation()
  const match = useRouteMatch('/table')
  const {
    pathname: currPathname,
    state: locState,
  } = useLocation() as LocWithState

  const [lastLoc, setLastLoc] = useState()
  const { data } = useFullData()

  // CRED:
  // help.mouseflow.com/en/articles/4310818-tracking-url-changes-with-react
  useEffect(() => {
    if (
      !loc.pathname.includes(routes.table) &&
      locState?.from !== routes.help
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // TODO: take some time, fix it
      setLastLoc(loc)
    }
  }, [loc, locState])

  // TODO: make this whole mess right. Can't use this approach on AboutPageView
  // b/c that isn't always mounted like ResultsModal. Have to supply it with
  // something? Or is this working??

  // Go back in history if route wasn't table-based, otherwise go home. Also
  // avoids an infinite cycle of table-help-table backness.
  const handleClose = (): void => {
    if (locState && locState?.from === routes.help) {
      history.push('/')
    } else {
      history.push({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // TODO: take some time, fix it
        pathname: lastLoc?.pathname || '/',
        state: { from: currPathname },
      })
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
      <ResultsTable data={data} />
    </Dialog>
  )
}

export default ResultsModal
