import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Divider, Button } from '@material-ui/core'
import { FaRandom } from 'react-icons/fa'
import { BiMapPin } from 'react-icons/bi'

import { GlobalContext, LangOrEndoIntro, ScrollToTopOnMount } from 'components'
import { LegendSwatch } from 'components/legend'
import { RecordDescription } from 'components/results'
import { paths as routes } from 'components/config/routes'
import { Media } from './Media'

// TODO: cell strength bars for Size
// import { COMM_SIZE_COL_MAP } from 'components/results/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: { padding: '0.65em 0 0.3em', textAlign: 'center' },
    divider: { marginBottom: '1.5em' },
    neighborhoods: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      display: 'flex',
      fontSize: '0.75em',
      fontStyle: 'italic',
      justifyContent: 'center',
      '& svg': {
        marginRight: '0.15em',
      },
    },
    descripSection: {
      fontSize: theme.typography.caption.fontSize,
      padding: '0 0.25rem',
    },
    noFeatSel: {
      marginBottom: '1em',
      fontSize: theme.typography.caption.fontSize,
    }, // push past the Help btn
    region: {
      display: 'inline-flex',
      justifyContent: 'center',
      padding: '0.25rem 4.5em',
      paddingBottom: 0,
      marginTop: '0.45em',
      borderTop: `dashed 1px ${theme.palette.divider}`,
    },
    countriesList: {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      fontSize: '0.75em',
      display: 'flex',
      columnGap: '0.5em',
      alignItems: 'center',
      justifyContent: 'center',
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
      '& > * + *': {
        marginLeft: '0.5em',
      },
      '& li': {
        marginTop: 0,
        fontSize: '0.85em',
        color: theme.palette.text.secondary,
      },
    },
  })
)

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

export const DetailsPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()
  const loc = useLocation()

  // Shaky check to see if features have loaded and are stored globally
  // TODO: use MB's loading events to set this instead
  if (!state.langFeatures.length) return null
  if (!state.selFeatAttribs) return <NoFeatSel /> // no sel feat details

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
  } = state.selFeatAttribs
  const { intro, descripSection, neighborhoods, divider } = classes
  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.legendSymbols[WorldRegion].paint['icon-color'] as string

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
        <LangOrEndoIntro attribs={state.selFeatAttribs} />
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
