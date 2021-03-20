import React, { FC } from 'react'

import { LegendPanel } from 'components/legend'
import { PanelContentSimple } from 'components/panels'
import { SearchByOmnibox } from './SearchByOmnibox'
import { FiltersWarning } from './FiltersWarning'

export const Home: FC = () => {
  return (
    <PanelContentSimple>
      <SearchByOmnibox />
      <FiltersWarning />
      <LegendPanel />
    </PanelContentSimple>
  )
}
