import React, { FC, useContext } from 'react'
import { FaFilter } from 'react-icons/fa'
import { GoSettings } from 'react-icons/go'
import { TiDocumentText, TiThList } from 'react-icons/ti'
import { Link } from '@material-ui/core'

import { GlobalContext } from 'components'

import { ResultsPanel } from 'components/results'
import { FiltersPanel } from 'components/filters'
import { LegendPanel } from 'components/legend'
import { DetailsPanel } from 'components/details'
import { MapPanelTypes } from 'components/map/types'
import { ActivePanelIndexType } from '../context/types'

type CheapLinkType = {
  text: string
  activePanelIndex: ActivePanelIndexType
}

const CheapLinkWithDispatch: FC<CheapLinkType> = ({
  text,
  activePanelIndex,
}) => {
  const { dispatch } = useContext(GlobalContext)

  return (
    <Link
      href="javascript;"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: activePanelIndex })
      }}
    >
      {text}
    </Link>
  )
}

export const panelsConfig = [
  {
    heading: 'Filter',
    subheading: 'and query language data',
    icon: <FaFilter />,
    summary: (
      <>
        Explore 1000+ language communities using the options below. Your filters
        affect both the map and{' '}
        <CheapLinkWithDispatch text="data table" activePanelIndex={1} />.
      </>
    ),
    component: <FiltersPanel />,
  },
  {
    heading: 'Data',
    subheading: 'as a searchable table',
    icon: <TiThList />,
    // Could this work instead of emoji API? Seems way too easy.
    // https://material-ui.com/components/autocomplete/#country-select
    component: <ResultsPanel />,
    summary: (
      <>
        View results of your{' '}
        <CheapLinkWithDispatch text="filters" activePanelIndex={0} /> in a table
        which you can further refine, sort, and search. Note that options here
        only affect the table below.
      </>
    ),
  },
  {
    heading: 'Details',
    subheading: 'of selected community',
    icon: <TiDocumentText />,
    component: <DetailsPanel />,
    summary: '',
  },
  {
    heading: 'Settings',
    subheading: 'for map symbols and labels',
    icon: <GoSettings />,
    component: <LegendPanel />,
    summary:
      'Visualize language communities in different ways by changing their symbols and labels below.',
  },
] as MapPanelTypes[]
