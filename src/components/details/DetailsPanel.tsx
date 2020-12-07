import React, { FC, useContext } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Typography, Divider } from '@material-ui/core'

import { GlobalContext } from 'components/context'
import { RecordDescription } from 'components/results'
import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { usePanelRootStyles } from 'components/panels/PanelContent'
import { LangOrEndoIntro } from './LangOrEndoIntro'
import { NeighborhoodList } from './NeighborhoodList'
import { NoFeatSel } from './NoFeatSel'
import { useStyles } from './styles'
import { findFeatureByID } from '../../utils'

export const DetailsPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()
  const match: { params: { id: string } } | null = useRouteMatch('/:any/:id')
  const matchedFeatID = match?.params?.id

  if (!matchedFeatID) return <NoFeatSel />

  // TODO: use MB's loading events to set this instead
  if (!state.langFeatures.length)
    return (
      <div className={`${panelRootClasses.root} ${classes.root}`}>
        <p>Loading communities...</p>
      </div>
    )

  const matchingRecord = findFeatureByID(
    state.langFeatures,
    parseInt(matchedFeatID, 10)
  )

  // TODO: send stuff to Sentry
  if (!matchingRecord)
    return (
      <div className={`${panelRootClasses.root} ${classes.root}`}>
        <NoFeatSel
          reason={`No community found with an ID of ${matchedFeatID}.`}
        />
      </div>
    )

  const elemID = 'details'
  const {
    Language: language,
    Neighborhood,
    Description: description,
    Town,
    Country,
    Audio: audio,
    Video: video,
    Macrocommunity: macro,
    'World Region': WorldRegion,
    // Size, // TODO: cell strength bars for Size
  } = matchingRecord

  document.title = `${language} - NYC Languages`

  return (
    <>
      {/* TODO: something that works */}
      {/* {state.panelState === 'default' && ( <ScrollToTopOnMount elemID={elemID} trigger={loc.pathname} /> )} */}
      <div className={`${panelRootClasses.root} ${classes.root}`} id={elemID}>
        <LangOrEndoIntro attribs={matchingRecord} />
        <NeighborhoodList neighborhoods={Neighborhood} town={Town} />
        <MoreLikeThis
          macro={macro}
          language={language}
          region={WorldRegion}
          country={Country}
        />
        <Media {...{ audio, video, language, description }} />
        <Divider variant="middle" className={classes.divider} />
        <Typography variant="body2" component="div" align="left">
          <RecordDescription text={description} />
        </Typography>
      </div>
    </>
  )
}
