import React, { FC, useContext } from 'react'
import queryString from 'query-string'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GlobalContext } from 'components'

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
  const classes = useStyles()
  const { state } = useContext(GlobalContext)

  const parsed = queryString.parse(window.location.search)
  const matchingRecord = state.langFeatures.find(
    (feature) => feature.ID === parsed.id
  )
  if (!matchingRecord) {
    return <p>Please select a feature.</p>
  }

  const heading = matchingRecord['Language Endonym'] || matchingRecord.Language

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
