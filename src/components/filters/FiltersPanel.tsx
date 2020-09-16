import React, { FC, useContext, useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'

import { GlobalContext, ScrollToTopOnMount } from 'components'
import { LegendPanel } from 'components/legend'
import { SearchByOmnibox } from './SearchByOmnibox'
import { LangRecordSchema } from '../../context/types'

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const elemID = 'filters-panel'
  const [data, setData] = useState<LangRecordSchema[]>([])

  useEffect((): void => setData(state.langFeatures), [state.langFeatures])

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <ScrollToTopOnMount elemID={elemID} />
      <Typography variant="h5" component="h3" id={elemID}>
        Search language communities
      </Typography>
      <SearchByOmnibox data={data} />
      <Typography variant="h5" component="h3">
        Legend
      </Typography>
      <LegendPanel
        legendItems={state.legendItems}
        groupName={state.activeLangSymbGroupId}
      />
    </>
  )
}
