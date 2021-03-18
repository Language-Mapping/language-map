import React, { FC } from 'react'
import { GoSearch } from 'react-icons/go'

import { LegendPanel } from 'components/legend'
import { PanelContentSimple, PanelHeading } from 'components/panels'
import { SearchByOmnibox } from './SearchByOmnibox'
import { FiltersWarning } from './FiltersWarning'

export const Home: FC = () => {
  return (
    <PanelContentSimple>
      <PanelHeading icon={<GoSearch />} text="Search language communities" />
      <SearchByOmnibox />
      <FiltersWarning />
      <LegendPanel />
    </PanelContentSimple>
  )
}
