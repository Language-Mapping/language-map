// TODO: rename file to Home or something
import React, { FC, useContext, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { GlobalContext, ScrollToTopOnMount } from 'components'
import { LegendPanel } from 'components/legend'
import { initLegend } from 'components/legend/utils'
import {
  useSymbAndLabelState,
  useLabelAndSymbDispatch,
} from '../../context/SymbAndLabelContext'
import { SearchByOmnibox } from './SearchByOmnibox'
import { LangRecordSchema } from '../../context/types'
import { FiltersWarning } from './FiltersWarning'
import symbLayers from '../map/config.lang-style'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelMainHeading: {
      // fontSize: '1.5rem', // TODO: consistentize w/other panels
    },
  })
)

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const symbLabelState = useSymbAndLabelState()
  const symbLabelDispatch = useLabelAndSymbDispatch()
  const classes = useStyles()
  const [data, setData] = useState<LangRecordSchema[]>([])
  const elemID = 'filters-panel'
  const { activeSymbGroupID, legendItems } = symbLabelState

  useEffect((): void => {
    initLegend(symbLabelDispatch, activeSymbGroupID, symbLayers)
  }, [activeSymbGroupID, symbLabelDispatch])

  useEffect((): void => setData(state.langFeatures), [state.langFeatures])

  return (
    <>
      {/* TODO: wire this back up here and anywhere else that needs it */}
      {/* ...and rm all places that don't */}
      {state.panelState === 'default' && <ScrollToTopOnMount elemID={elemID} />}
      <Typography
        className={classes.panelMainHeading}
        variant="h4"
        component="h2"
        id={elemID}
      >
        Search language communities
      </Typography>
      <SearchByOmnibox data={data} />
      <FiltersWarning />
      <LegendPanel legendItems={legendItems} groupName={activeSymbGroupID} />
    </>
  )
}
