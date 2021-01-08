import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { RecordDescription } from 'components/results'
import { DetailedIntro } from 'components/details'
import { PanelContentSimple } from 'components/panels/PanelContent'
import { LoadingIndicatorPanel } from 'components/generic/modals'
import { NoFeatSel } from './NoFeatSel'
import { useDetails } from './hooks'
import { DetailsPanelProps } from './types'

const DetailsWrap: FC = () => {
  const { isLoading, error, data, id } = useDetails()

  if (isLoading) return <LoadingIndicatorPanel />
  if (error) return <p>Something went wrong looking for this community.</p>
  // if (notFound || !data) // TODO
  if (!data)
    return <NoFeatSel reason={`No community found with an id of ${id}.`} />

  const { instanceDescripID, langDescripID, Language } = data
  const descripID = instanceDescripID || langDescripID

  document.title = `${Language} - NYC Languages`

  return (
    <>
      <DetailedIntro data={data} isInstance />
      {/* There should always be a description, but checking just in case */}
      {descripID && (
        <Typography variant="body2" component="div" align="left">
          <RecordDescription
            descriptionID={descripID}
            descripTable={
              instanceDescripID ? 'Descriptions' : 'Language Descriptions'
            }
          />
        </Typography>
      )}
    </>
  )
}

export const DetailsPanel: FC<DetailsPanelProps> = (props) => {
  const { routeBase = 'details' } = props

  return (
    <PanelContentSimple>
      <Switch>
        <Route path={`/${routeBase}/:id`}>
          <DetailsWrap />
        </Route>
        <Route path={`/${routeBase}`} exact>
          <NoFeatSel />
        </Route>
      </Switch>
    </PanelContentSimple>
  )
}
