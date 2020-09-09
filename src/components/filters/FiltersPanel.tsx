import React, { FC, useContext } from 'react'
import { Typography } from '@material-ui/core'

import { GlobalContext } from 'components'
import { LegendPanel } from 'components/legend'
import { SearchByOmnibox } from './SearchByOmnibox'

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const { langSymbGroups, activeLangSymbGroupId } = state
  /* eslint-disable operator-linebreak */
  const groupName = langSymbGroups[activeLangSymbGroupId]
    ? langSymbGroups[activeLangSymbGroupId].name
    : ''
  /* eslint-enable operator-linebreak */

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <Typography variant="h5" component="h3">
        Search language communities
      </Typography>
      <SearchByOmnibox
        data={state.langFeatures}
        noFiltersSet={state.langFeatIDs !== null}
      />
      <Typography variant="h5" component="h3">
        Legend
      </Typography>
      {state.mapLoaded && (
        <LegendPanel legendItems={state.legendItems} groupName={groupName} />
      )}
    </>
  )
}
