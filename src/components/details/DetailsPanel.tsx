import React, { FC, useContext } from 'react'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { Typography, Divider, Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext, LangOrEndoIntro } from 'components'
import { RecordDescription } from 'components/results'
import { paths as routes } from 'components/config/routes'
import { Media } from 'components/media'
import { MoreLikeThis } from 'components/details'
import { usePanelRootStyles } from 'components/panels/PanelContent'
import { useStyles } from './styles'
import { findFeatureByID } from '../../utils'

type NeighborhoodList = {
  town: string
  neighborhoods: string
}

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

const NeighborhoodList: FC<NeighborhoodList> = (props) => {
  const { town, neighborhoods } = props
  const classes = useStyles()

  return (
    <Typography className={classes.neighborhoods}>
      <BiMapPin />
      {neighborhoods &&
        neighborhoods.split(', ').map((place, i) => (
          <React.Fragment key={place}>
            {i !== 0 && <span className={classes.separator}>|</span>}
            <RouterLink to={`/Explore/Neighborhood/${place}`}>
              {place}
            </RouterLink>
          </React.Fragment>
        ))}
      {/* At least for now, not linking to Towns */}
      {!neighborhoods && town}
    </Typography>
  )
}

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
