import React, { FC, useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { Dialog } from '@material-ui/core'

import { DialogCloseBtn, SlideUp } from 'components/generic/modals'
import { InstanceLevelSchema, GlobalContext } from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import { routes } from 'components/config/api'
import { useStyles } from './styles'
import { ResultsTable } from './ResultsTable'
import { LocWithState } from '../config/types'
import { whittleLangFeats } from './utils'

// CRED: https://stackoverflow.com/a/51808262/1048518
const fields: Array<Extract<keyof InstanceLevelSchema, string>> = [
  'Additional Neighborhoods',
  'Audio',
  'countryImg',
  'County',
  'Country',
  'Endonym',
  'Global Speaker Total',
  'Glottocode',
  'id',
  'ISO 639-3',
  'Language Family',
  'Language',
  'Latitude',
  'Longitude',
  'Neighborhood',
  'Primary Location',
  'sizeColor',
  'Size',
  'Status',
  'Video',
  'World Region',
  'worldRegionColor',
]

const ResultsModal: FC = () => {
  const classes = useStyles()
  const { dispatch } = useContext(GlobalContext)

  const history = useHistory()
  const loc = useLocation()
  const match = useRouteMatch(routes.data)
  const { pathname: currPathname, state: locState } = useLocation<
    LocWithState
  >() as LocWithState

  const [lastLoc, setLastLoc] = useState()
  const { data, isLoading, error } = useAirtable<InstanceLevelSchema>('Data', {
    fields,
    // Save a little bandwidth on local dev (30 is enough to paginate)
    maxRecords: window?.location.hostname === 'lampel-2.local' ? 30 : 20000,
  })

  // CRED:
  // help.mouseflow.com/en/articles/4310818-tracking-url-changes-with-react
  useEffect(() => {
    if (!currPathname.includes(routes.data) && locState?.from !== routes.help) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // TODO: take some time, fix it
      setLastLoc(loc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPathname, locState])

  useEffect(() => {
    if (isLoading || !data.length) return

    dispatch({
      type: 'SET_LANG_LAYER_FEATURES',
      payload: whittleLangFeats(data),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

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

  if (error) return null

  return (
    <Dialog
      open={match !== null}
      keepMounted // TODO: come on
      TransitionComponent={SlideUp}
      className={`${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="lg"
      PaperProps={{ className: classes.resultsModalPaper }}
    >
      <DialogCloseBtn onClose={handleClose} tooltip="Exit to map" />
      {error ? 'An error occurred fetching table data' : null}
      {!error && <ResultsTable data={data} />}
    </Dialog>
  )
}

export default ResultsModal
