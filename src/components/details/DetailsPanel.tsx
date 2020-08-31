import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GlobalContext } from 'components'
import { LegendSwatch } from 'components/legend'
import { RecordDescription, CountryListItemWithFlag } from 'components/results'
import { CountryCodes } from 'components/results/types'
import countryCodes from 'components/results/config.emojis.json'
import { isURL, correctDropboxURL, prettyTruncateList } from '../../utils'
import { Media } from './Media'

// TODO: cell strength bars for Size
// import { COMM_SIZE_COL_MAP } from 'components/results/config'

// TODO: share it
const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhoods and Countries

type EndoImageComponent = {
  url: string
  alt: string
}

type CountriesWithFlagsProps = {
  countries: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      padding: '0.75em 0',
      textAlign: 'center',
      borderBottom: `solid 1px ${theme.palette.divider}`,
    },
    // Gross but it makes `Anashinaabemowin` fit
    detailsPanelHeading: {
      fontSize: '2.4rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '3rem',
      },
    },
    endoImage: {
      height: 120,
      maxWidth: '95%',
    },
    neighborhoods: {
      // fontSize: '0.8rem',
      // fontSize: theme.typography.caption.fontSize,
      fontSize: '0.75em',
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
    },
    description: {
      fontSize: theme.typography.caption.fontSize,
      padding: '0 0.25rem',
      marginBottom: '2.4rem',
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
      // fontSize: theme.typography.caption.fontSize,
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

// Mongolian, ASL, etc. have URLs to images
const EndoImageWrap: FC<EndoImageComponent> = (props) => {
  const classes = useStyles()
  const { url: origUrl, alt } = props
  const url = correctDropboxURL(origUrl)

  return <img src={url} alt={alt} className={classes.endoImage} />
}

const RandomLink: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langFeatIDs, langFeaturesCached } = state

  if (langFeatIDs && !langFeatIDs.length) {
    return null
  }

  let randoIndex = 1
  let id = 1

  if (langFeatIDs === null) {
    randoIndex = Math.floor(Math.random() * langFeaturesCached?.length) + 1
    id = langFeaturesCached[randoIndex].ID
  } else {
    randoIndex = Math.floor(Math.random() * langFeatIDs?.length) + 1
    id = langFeatIDs[randoIndex]
  }

  return (
    <>
      , or <RouterLink to={`/details?id=${id}`}>try one at random</RouterLink>
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

const CountriesWithFlags: FC<CountriesWithFlagsProps> = (props) => {
  const { countries: unParsed } = props
  const classes = useStyles()
  const countryCodesTyped = countryCodes as CountryCodes // TODO: defeat this
  const countries = unParsed.split(DEFAULT_DELIM)

  const countriesWithFlags = countries.map((country) => {
    if (countryCodesTyped[country]) {
      return countryCodesTyped[country]
    }

    return '' // there SHOULD be a match but if not then just use blank
  })

  return (
    <ul className={classes.countriesList}>
      {countriesWithFlags.map((countryWithFlag, i) => (
        <CountryListItemWithFlag
          key={countries[i]}
          countryCode={countryWithFlag}
          name={countries[i]}
        />
      ))}
    </ul>
  )
}

export const DetailsPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()

  // Shaky check to see if features have loaded and are stored globally
  // TODO: use MB's loading events to set this instead
  if (!state.langFeaturesCached.length) return null

  const { selFeatAttribs } = state

  // No sel feat details
  if (!selFeatAttribs) return <NoFeatSel />

  const {
    Endonym,
    Language,
    Neighborhoods,
    Description,
    // Size, // TODO: cell strength bars for Size
    Town,
    Countries,
    Audio: audio,
    Video: video,
    'World Region': WorldRegion,
  } = selFeatAttribs
  const { detailsPanelHeading, intro, description, neighborhoods } = classes
  const isImage = isURL(Endonym)
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
      <div className={intro}>
        {(isImage && <EndoImageWrap url={Endonym} alt={Language} />) || (
          <Typography variant="h3" className={detailsPanelHeading}>
            {Endonym}
          </Typography>
        )}
        {Endonym !== Language && (
          <Typography variant="caption" component="p">
            {Language}
          </Typography>
        )}
        {/* TODO: make "+4 more clickable to toggle popover" */}
        <Typography className={neighborhoods}>
          {Neighborhoods ? prettyTruncateList(Neighborhoods) : Town}
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
        {/* <CountriesWithFlags countries={Countries} /> */}
        <div className={classes.countriesList}>{Countries}</div>
        <Media {...{ audio, video, language: Language }} />
      </div>
      <Typography variant="body2" className={description}>
        <RecordDescription text={Description} />
      </Typography>
    </>
  )
}
