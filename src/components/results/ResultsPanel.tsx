import React, { FC, useContext, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import { AiOutlineFullscreen } from 'react-icons/ai'

import { GlobalContext, LoadingIndicator } from 'components'
import { useTableStyles } from './config'
import { ResultsTable } from './ResultsTable'
import { ResultsModal } from './ResultsModal'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsPanelRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
    featureCount: {
      marginBottom: theme.spacing(1),
      fontSize: theme.typography.caption.fontSize,
    },
  })
)

export const ResultsPanel: FC = () => {
  const classes = useStyles()
  const sharedTableClasses = useTableStyles()
  const { state } = useContext(GlobalContext)
  const { langFeaturesCached, langFeatures } = state
  const [resultsModalOpen, setResultsModalOpen] = useState<boolean>(false)

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length) {
    return <LoadingIndicator />
  }

  // TODO: highlight selected feature in table
  // const parsed = queryString.parse(window.location.search)
  // const matchingRecord = state.langFeatures.find(
  //   (feature) => feature.ID === parsed.id
  // )

  // TODO: https://reactjs.org/docs/react-api.html#cloneelement
  // React.cloneElement(element, [props], [...children])

  return (
    <div
      className={`${classes.resultsPanelRoot} ${sharedTableClasses.tableRoot}`}
    >
      <Typography className={classes.featureCount}>
        Showing {langFeatures.length} of {langFeaturesCached.length} language
        communities.
      </Typography>
      <Button
        onClick={() => setResultsModalOpen(true)}
        color="primary"
        size="small"
        variant="contained"
        startIcon={<AiOutlineFullscreen />}
      >
        View fullscreen
      </Button>
      {resultsModalOpen && (
        <ResultsModal setResultsModalOpen={setResultsModalOpen}>
          <ResultsTable setResultsModalOpen={setResultsModalOpen} />
        </ResultsModal>
      )}
      <ResultsTable setResultsModalOpen={setResultsModalOpen} />
    </div>
  )
}
