import React, { FC, useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Divider } from '@material-ui/core'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import queryString from 'query-string'
import { GlobalContext, LoadingIndicator } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsPanelRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    intro: {
      textAlign: 'center',
      paddingBottom: theme.spacing(1),
    },
    description: {
      marginTop: theme.spacing(1),
      fontSize: theme.typography.caption.fontSize,
    },
  })
)

export const DetailsPanel: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getLocation = useLocation() // must exist for routing to work?
  const classes = useStyles()
  const { state } = useContext(GlobalContext)

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length) {
    return <LoadingIndicator />
  }

  const parsed = queryString.parse(window.location.search)
  const matchingRecord = state.langFeatures.find(
    (feature) => feature.ID === parseInt(parsed.id, 10)
  )

  // No `id` in `search` params
  if (!parsed.id) {
    return (
      <p>
        Click a language community in the map or the{' '}
        <RouterLink to="/results">Data panel</RouterLink> to learn more.
      </p>
    )
  }

  if (!matchingRecord) {
    return (
      <p>
        Feature with id <b>{parsed.id}</b> not found.
      </p>
    )
  }

  const heading = matchingRecord.Endonym || matchingRecord.Language
  document.title = `${matchingRecord.Language as string} - NYC Languages`

  return (
    <div className={classes.detailsPanelRoot}>
      <RouterLink to="/results">{`<`} Back to results</RouterLink>
      <div className={classes.intro}>
        <Typography component="h3" variant="h4">
          {heading}
        </Typography>
        {/* TODO: rm existence check once Endonym column fully populated */}
        {matchingRecord.Endonym &&
          matchingRecord.Endonym !== matchingRecord.Language && (
            <>
              <Typography variant="caption">
                {`(${matchingRecord.Language})`}
              </Typography>
              <br />
            </>
          )}
        <small>
          <i>{matchingRecord.Neighborhood}</i>
        </small>
      </div>
      <Divider />
      <Typography variant="body2" className={classes.description}>
        {matchingRecord.Description}
      </Typography>
    </div>
  )
}
