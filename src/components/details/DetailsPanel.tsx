import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GlobalContext, LangOrEndoIntro, ScrollToTopOnMount } from 'components'
import { LegendSwatch } from 'components/legend'
import { RecordDescription } from 'components/results'
import { paths as routes } from 'components/config/routes'
import { Media } from './Media'

// TODO: cell strength bars for Size
// import { COMM_SIZE_COL_MAP } from 'components/results/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      padding: '0.65em 0 0.3em',
      textAlign: 'center',
      borderBottom: `solid 1px ${theme.palette.divider}`,
      marginBottom: '1em',
    },
    neighborhoods: {
      fontSize: '0.75em',
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
    },
    descripSection: {
      fontSize: theme.typography.caption.fontSize,
      padding: '0 0.25rem',
      // marginBottom: '2.4rem', // bad for Explore on mobile!
    },
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
const RandomLink: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langFeatures } = state

  if (!langFeatures.length) return null

  const randoIndex = Math.floor(Math.random() * (langFeatures.length - 1))
  const id = langFeatures[randoIndex].ID

  return (
    <>
      , or{' '}
      <RouterLink to={`${routes.details}?id=${id}`}>
        try one at random
      </RouterLink>
    </>
  )
}

const NoFeatSel: FC = () => {
  return (
    <small>
      No community selected. Click a community in the map, in the data table
      <RandomLink />.
    </small>
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
  const { intro, descripSection, neighborhoods } = classes
  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.legendSymbols[WorldRegion].paint['circle-color']

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
          {Neighborhoods || Town}
        </Typography>
        <div className={classes.region}>
          <LegendSwatch
            legendLabel={WorldRegion}
            component="div"
            backgroundColor={regionSwatchColor}
            type="circle"
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
      <Typography variant="body2" className={descripSection} component="div">
        <RecordDescription text={description} />
      </Typography>
    </>
  )
}
