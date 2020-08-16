import React, { FC, useState, useContext } from 'react'
import { Button } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'

import { GlobalContext, LoadingIndicator } from 'components'
import { ResultsTable, ResultsModal } from 'components/results'
import { LegendPanel } from 'components/legend'

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const [resultsModalOpen, setResultsModalOpen] = useState<boolean>(false)

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length || !state.mapLoaded) {
    return <LoadingIndicator />
  }

  // TODO: for Countries selection:
  // https://material-ui.com/components/autocomplete/#country-select
  return (
    <>
      <Button
        // TODO: <Route>
        onClick={() => setResultsModalOpen(true)}
        color="primary"
        size="small"
        variant="contained"
        startIcon={<TiThList />}
      >
        View data table
      </Button>
      {/* TODO: <Route> */}
      {resultsModalOpen && (
        <ResultsModal setResultsModalOpen={setResultsModalOpen}>
          <ResultsTable setResultsModalOpen={setResultsModalOpen} />
        </ResultsModal>
      )}
      <LegendPanel legendItems={state.legendItems} />
    </>
  )
}
