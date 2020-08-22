import React, { FC, useContext } from 'react'

import { ClearFiltersBtn } from 'components/filters'
import { GlobalContext, LoadingIndicator } from 'components'
import { LegendPanel } from 'components/legend'
import { ViewResultsDataBtn } from 'components/results/ViewResultsDataBtn'
import { SearchByOmnibox } from './SearchByOmnibox'

export const FiltersPanel: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length || !state.mapLoaded) {
    return <LoadingIndicator />
  }

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <SearchByOmnibox data={state.langFeatures} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          gridColumnGap: 12,
          marginBottom: 8,
        }}
      >
        <ViewResultsDataBtn />
        <ClearFiltersBtn
          enabled={state.langFeatIDs !== null}
          onClick={() =>
            dispatch({
              type: 'SET_LANG_FEAT_IDS',
              payload: null,
            })
          }
        />
      </div>
      <LegendPanel legendItems={state.legendItems} />
    </>
  )
}
