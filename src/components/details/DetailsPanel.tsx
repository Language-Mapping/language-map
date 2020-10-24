import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import { Typography, Divider, Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext, LangOrEndoIntro, ScrollToTopOnMount } from 'components'
import { LegendSwatch } from 'components/legend'
import { RecordDescription } from 'components/results'
import { paths as routes } from 'components/config/routes'
import { Media } from 'components/media'
import { useSymbAndLabelState } from '../../context/SymbAndLabelContext'
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
  const symbLabelState = useSymbAndLabelState()
  const classes = useStyles()
  const loc = useLocation()
  const { id } = useParams<{ id: string }>()

  // TODO: use MB's loading events to set this instead
  if (!state.langFeatures.length) return <p>Communities are still loading...</p>
  if (!id) return <NoFeatSel />

  const matchingRecord = findFeatureByID(state.langFeatures, parseInt(id, 10))

  // TODO: send stuff to Sentry
  if (!matchingRecord)
    return <NoFeatSel reason={`No community found with an ID of ${id}.`} />

  const elemID = 'details'
  const {
    Language: language,
    Neighborhoods,
    Description: description,
    Town,
    Countries,
    Audio: audio,
    Video: video,
    'World Region': WorldRegion,
    // Size, // TODO: cell strength bars for Size
  } = matchingRecord
  const { intro, descripSection, neighborhoods, divider } = classes
  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    symbLabelState.legendSymbols[WorldRegion].paint['icon-color'] as string

  return (
    <>
      {state.panelState === 'default' && (
        <ScrollToTopOnMount elemID={elemID} trigger={loc.pathname} />
      )}
      <div className={intro} id={elemID}>
        <LangOrEndoIntro attribs={matchingRecord} />
        <Typography className={neighborhoods}>
          <BiMapPin />
          {Neighborhoods || Town}
        </Typography>
        <div className={classes.region}>
          <LegendSwatch
            legendLabel={WorldRegion}
            component="div"
            iconID="_circle"
            backgroundColor={regionSwatchColor || 'transparent'}
          />
          {/* TODO: cell strength bars for Size */}
        </div>
        <div className={classes.countriesList}>{Countries}</div>
        <Media
          {...{
            audio,
            video,
            language,
            description,
          }}
        />
      </div>
      <Divider variant="middle" className={divider} />
      <Typography variant="body2" className={descripSection} component="div">
        <RecordDescription text={description} />
      </Typography>
    </>
  )
}
