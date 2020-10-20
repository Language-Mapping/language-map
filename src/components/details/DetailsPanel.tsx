import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
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
import { LangRecordSchema } from '../../context/types'

type DetailsPanelProps = {
  attribsDirect?: LangRecordSchema
  skipSelFeatCheck?: boolean
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
      to={`${routes.details}?id=${id}`}
    >
      Try one at random
    </Button>
  )
}

const NoFeatSel: FC = () => {
  const classes = useStyles()

  return (
    <div style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}>
      <Typography className={classes.noFeatSel}>
        No community selected. Click a community in the map or in the data
        table.
      </Typography>
      <RandomLinkBtn />
    </div>
  )
}

export const DetailsPanel: FC<DetailsPanelProps> = (props) => {
  const { attribsDirect, skipSelFeatCheck } = props
  const { state } = useContext(GlobalContext)
  const symbLabelState = useSymbAndLabelState()
  const classes = useStyles()
  const loc = useLocation()
  const attribsToUse = attribsDirect || state.selFeatAttribs

  // Shaky check to see if features have loaded and are stored globally
  // TODO: use MB's loading events to set this instead
  if (!state.langFeatures.length) return null
  if (!state.selFeatAttribs && !skipSelFeatCheck) return <NoFeatSel />
  if (!attribsToUse) return null

  const elemID = 'details'
  const {
    Language: language,
    Neighborhoods,
    Description: description,
    // Size, // TODO: cell strength bars for Size
    Town,
    Countries,
    Audio: audio,
    Video: video,
    'World Region': WorldRegion,
  } = attribsToUse
  const { intro, descripSection, neighborhoods, divider } = classes
  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    symbLabelState.legendSymbols[WorldRegion].paint['icon-color'] as string

  // TODO: deal with `id` present in URL but no match found
  // const parsed = queryString.parse(window.location.search)
  // const matchingRecord = state.langFeatures.find(
  //   (feature) => feature.ID === parsed.id
  // )

  return (
    <>
      {state.panelState === 'default' && (
        <ScrollToTopOnMount elemID={elemID} trigger={loc.pathname} />
      )}
      <div className={intro} id={elemID}>
        <LangOrEndoIntro attribs={attribsToUse} />
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
