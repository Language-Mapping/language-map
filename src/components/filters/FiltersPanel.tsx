import React, { FC, useContext } from 'react'

import { GlobalContext, LoadingIndicator } from 'components'
import { LegendPanel } from 'components/legend'
import { ViewResultsDataBtn } from 'components/results/ViewResultsDataBtn'

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length || !state.mapLoaded) {
    return <LoadingIndicator />
  }

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <div style={{ textAlign: 'center', margin: 8 }}>
        <ViewResultsDataBtn />
      </div>
      <LegendPanel legendItems={state.legendItems} />
    </>
  )
}
