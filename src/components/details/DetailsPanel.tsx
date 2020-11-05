import React, { FC, useContext } from 'react'
import {
  Link as RouterLink,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import { Typography, Divider, Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext, LangOrEndoIntro, ScrollToTopOnMount } from 'components'
import { RecordDescription } from 'components/results'
import { paths as routes } from 'components/config/routes'
import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { useStyles } from './styles'
import { findFeatureByID } from '../../utils'

// TODO: separate files
const RandomLinkBtn: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  if (!langFeatures.length) return null

  const randoIndex = Math.floor(Math.random() * (langFeatures.length - 1))
  const id = langFeatures[randoIndex].ID

  return (
    <Button
      variant="contained"
      color="primary"
      component={RouterLink}
      size="small"
      startIcon={<FaRandom />}
      to={`${routes.details}/${id}`}
    >
      Try one at random
    </Button>
  )
}

const NoFeatSel: FC<{ reason?: string }> = (props) => {
  const { reason = 'No community selected.' } = props
  const classes = useStyles()

  return (
    <div style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}>
      <Typography className={classes.noFeatSel}>
        {reason} Click a community in the map or in the data table.
      </Typography>
      <RandomLinkBtn />
    </div>
  )
}

export const DetailsPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()
  const loc = useLocation()
  const match: { params: { id: string } } | null = useRouteMatch('/:any/:id')
  const matchedFeatID = match?.params?.id

  // TODO: use MB's loading events to set this instead
  if (!state.langFeatures.length) return <p>Loading communities...</p>
  if (!matchedFeatID) return <NoFeatSel />

  const matchingRecord = findFeatureByID(
    state.langFeatures,
    parseInt(matchedFeatID, 10)
  )

  // TODO: send stuff to Sentry
  if (!matchingRecord)
    return (
      <NoFeatSel
        reason={`No community found with an ID of ${matchedFeatID}.`}
      />
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
    'Macro-Community': macro,
    'World Region': WorldRegion,
    // Size, // TODO: cell strength bars for Size
  } = matchingRecord
  const { intro, descripSection, neighborhoods, divider } = classes
  const primaryCountry = Country.split(', ')[0]

  document.title = `${language} - NYC Languages`

  return (
    <>
      {state.panelState === 'default' && (
        <ScrollToTopOnMount elemID={elemID} trigger={loc.pathname} />
      )}
      <div className={intro} id={elemID}>
        <LangOrEndoIntro attribs={matchingRecord} />
        <Typography className={neighborhoods}>
          <BiMapPin />
          {Neighborhood || Town}
        </Typography>
        <MoreLikeThis
          macro={macro}
          language={language}
          region={WorldRegion}
          country={primaryCountry}
        />
        {/* Don't be redundant with country (already in chip) if only one */}
        {Country.includes(', ') && (
          <div className={classes.countriesList}>{Country}</div>
        )}
        <Media {...{ audio, video, language, description }} />
      </div>
      <Divider variant="middle" className={divider} />
      <Typography variant="body2" className={descripSection} component="div">
        <RecordDescription text={description} />
      </Typography>
    </>
  )
}
