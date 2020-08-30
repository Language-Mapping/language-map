import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Divider } from '@material-ui/core'

import { GlobalContext } from 'components'
import { isURL, correctDropboxURL, prettyTruncateList } from '../../utils'

type EndoImageComponent = {
  url: string
  alt: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      padding: '0.5em',
      textAlign: 'center',
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
      fontSize: '0.8rem',
      fontStyle: 'italic',
    },
    description: {
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing(1),
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

const NoFeatSel: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.intro}>
      <small>
        No community selected. Click a language community in the map or the data
        table to see detailed information.
      </small>
    </div>
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

  const { Endonym, Language, Neighborhoods, Description } = selFeatAttribs
  const { detailsPanelHeading, intro, description, neighborhoods } = classes
  const isImage = isURL(Endonym)

  // TODO: deal with `id` present in URL but no match found
  // const parsed = queryString.parse(window.location.search)
  // const matchingRecord = state.langFeatures.find(
  //   (feature) => feature.ID === parsed.id
  // )

  // TODO: something respectable for styles, aka MUI-something
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
        {Neighborhoods && (
          <Typography className={neighborhoods}>
            {prettyTruncateList(Neighborhoods)}
          </Typography>
        )}
      </div>
      <Divider />
      <Typography variant="body2" className={description}>
        {Description}
      </Typography>
    </>
  )
}
