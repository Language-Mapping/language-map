import React, { FC, useContext } from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GlobalContext, LoadingIndicator } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailsPanelRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
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
    (feature) => feature.ID === parsed.id
  )

  // No `id` in `search` params
  if (!parsed.id) {
    // TODO: link to Results...
    return <p>Please select a feature from the map or "Results" panel.</p>
  }

  if (!matchingRecord) {
    return (
      <p>
        Feature with id <b>{parsed.id}</b> not found.
      </p>
    )
  }

  const heading = matchingRecord['Language Endonym'] || matchingRecord.Language
  document.title = `${matchingRecord.Language as string} - NYC Languages`

  return (
    <div className={classes.detailsPanelRoot}>
      <Typography variant="h3">{heading}</Typography>
      {matchingRecord['Language Endonym'] !== matchingRecord.Language && (
        <>
          <Typography variant="caption">
            {`(${matchingRecord.Language})`}
          </Typography>
          <br />
        </>
      )}
      <small>
        <i>{matchingRecord['NYC Neighborhood']}</i>
      </small>
    </div>
  )
}
