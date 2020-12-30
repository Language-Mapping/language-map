import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { RecordDescription } from 'components/results'
import { DetailedIntro } from 'components/details'
import { usePanelRootStyles } from 'components/panels/PanelContent'
import { LoadingIndicatorPanel } from 'components/generic/modals'
import { NoFeatSel } from './NoFeatSel'
import { useDetailsNew } from './hooks'
import { DetailsPanelProps } from './types'

const DetailsWrap: FC = () => {
  const { isLoading, error, data, id } = useDetailsNew()

  if (isLoading) return <LoadingIndicatorPanel />
  if (error) return <p>Something went wrong looking for this community.</p>
  // if (notFound || !data) // TODO
  if (!data)
    return <NoFeatSel reason={`No community found with an id of ${id}.`} />

  const { Description, 'Language Description': langDescrip = '' } = data
  const description = Description || langDescrip

  document.title = `${data.Language} - NYC Languages`

  return (
    <>
      {/* TODO: something that works */}
      {/* {state.panelState === 'default' && ( <ScrollToTopOnMount elemID={elemID} trigger={loc.pathname} /> )} */}
      <DetailedIntro data={data} isInstance />
      {description && (
        <Typography variant="body2" component="div" align="left">
          <RecordDescription text={description} />
        </Typography>
      )}
    </>
  )
}

export const DetailsPanel: FC<DetailsPanelProps> = (props) => {
  const { routeBase = 'details', id } = props
  const panelRootClasses = usePanelRootStyles()

  return (
    <div className={panelRootClasses.root} id={id || routeBase}>
      <Switch>
        <Route path={`/${routeBase}/:id`}>
          <DetailsWrap />
        </Route>
        <Route path={`/${routeBase}`} exact>
          <NoFeatSel />
        </Route>
      </Switch>
    </div>
  )
}
