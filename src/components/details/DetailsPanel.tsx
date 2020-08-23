import React, { FC, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Divider } from '@material-ui/core'

import { RouteLocation } from 'components/map/types'
import { GlobalContext, LoadingIndicator, PanelIntro } from 'components'
import { DetailsIntro } from './DetailsIntro'

const DATA_TABLE_PATHNAME: RouteLocation = '/table'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      paddingBottom: theme.spacing(1),
      textAlign: 'center',
    },
    // Gross but it makes `Anashinaabemowin` fit
    detailsPanelHeading: {
      fontSize: '2.4rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '3rem',
      },
    },
    detailsSubheading: {
      marginBottom: theme.spacing(1),
    },
    description: {
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing(1),
    },
  })
)
export const DetailsPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()

  // Shaky check to see if features have loaded and are stored globally
  // TODO: use MB's loading events to set this instead
  if (!state.langFeaturesCached.length) {
    // TODO: skeletons
    return <LoadingIndicator />
  }

  const { selFeatAttribs } = state

  // No sel feat details
  if (!selFeatAttribs) {
    return (
      <PanelIntro>
        Click a language community in the map or visit the{' '}
        <RouterLink
          to={DATA_TABLE_PATHNAME}
          title="Data table of language communities"
        >
          data table
        </RouterLink>{' '}
        to view and filter all communities.
      </PanelIntro>
    )
  }

  // TODO: deal with `id` present in URL but no match found
  // const parsed = queryString.parse(window.location.search)
  // const matchingRecord = state.langFeatures.find(
  //   (feature) => feature.ID === parsed.id
  // )

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <DetailsIntro />
      <div className={classes.intro}>
        <Typography variant="h3" className={classes.detailsPanelHeading}>
          {selFeatAttribs.Endonym}
        </Typography>
        {selFeatAttribs.Endonym !== selFeatAttribs.Language && (
          <Typography variant="caption" className={classes.detailsSubheading}>
            {`(${selFeatAttribs.Language})`}
          </Typography>
        )}
        {selFeatAttribs.Neighborhoods && (
          <small>
            <i>{selFeatAttribs.Neighborhoods.split(', ')[0]}</i>
          </small>
        )}
      </div>
      <Divider />
      <Typography variant="body2" className={classes.description}>
        {selFeatAttribs.Description}
      </Typography>
    </>
  )
}
