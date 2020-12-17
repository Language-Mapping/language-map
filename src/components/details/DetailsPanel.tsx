import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Divider } from '@material-ui/core'

import { RecordDescription } from 'components/results'
import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { usePanelRootStyles } from 'components/panels/PanelContent'
import { LangOrEndoIntro } from './LangOrEndoIntro'
import { NoFeatSel } from './NoFeatSel'
import { useDetails } from './hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },
    divider: { marginBottom: '1.5em' },
  })
)

const Loading: FC = () => {
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()

  return (
    <div className={`${panelRootClasses.root} ${classes.root}`}>
      <p>Loading communities...</p>
    </div>
  )
}

const Details: FC = () => {
  const classes = useStyles()
  const { isLoading, error, notFound, data, id } = useDetails()

  if (isLoading) return <Loading />
  if (error) return <p>Something went wrong looking for this community.</p>
  if (notFound || !data)
    return <NoFeatSel reason={`No community found with an id of ${id}.`} />

  const { Description: description, Language } = data

  document.title = `${Language} - NYC Languages`

  return (
    <>
      {/* TODO: something that works */}
      {/* {state.panelState === 'default' && ( <ScrollToTopOnMount elemID={elemID} trigger={loc.pathname} /> )} */}
      <LangOrEndoIntro data={data} />
      <MoreLikeThis data={data} />
      <Media data={data} />
      <Divider variant="middle" className={classes.divider} />
      <Typography variant="body2" component="div" align="left">
        <RecordDescription text={description} />
      </Typography>
    </>
  )
}

export const DetailsPanel: FC = () => {
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()

  return (
    <div className={`${panelRootClasses.root} ${classes.root}`} id="details">
      <Switch>
        <Route path="/details/:id">
          <Details />
        </Route>
        <Route path="/details" exact>
          <NoFeatSel />
        </Route>
      </Switch>
    </div>
  )
}
