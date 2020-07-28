import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import queryString from 'query-string'
import { GlobalContext, LoadingIndicator } from 'components'
import { ResultsTable } from './ResultsTable'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsPanelRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
  })
)

export const ResultsPanel: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getLocation = useLocation() // must exist for routing to work?
  const classes = useStyles()
  const { state } = useContext(GlobalContext)
  const { langFeaturesCached, langFeatures } = state

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length) {
    return <LoadingIndicator />
  }

  // TODO: highlight selected feature in table
  // const parsed = queryString.parse(window.location.search)
  // const matchingRecord = state.langFeatures.find(
  //   (feature) => feature.ID === parsed.id
  // )

  return (
    <div className={classes.resultsPanelRoot}>
      <Typography variant="subtitle2">
        Showing {langFeatures.length} of {langFeaturesCached.length} total
        language communities.
      </Typography>
      <ResultsTable />
    </div>
  )
}
