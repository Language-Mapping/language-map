// TODO: rename file to Home or something
import React, { FC, useContext, useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { GoSearch } from 'react-icons/go'

import { GlobalContext } from 'components/context'
import { ScrollToTopOnMount } from 'components/generic'
import { LegendPanel } from 'components/legend'
import { initLegend } from 'components/legend/utils'
import { usePanelRootStyles } from 'components/panels'
import {
  useSymbAndLabelState,
  useLabelAndSymbDispatch,
} from 'components/context/SymbAndLabelContext'
import { LangRecordSchema } from 'components/context/types'
import { SearchByOmnibox } from './SearchByOmnibox'
import { FiltersWarning } from './FiltersWarning'
import symbLayers from '../map/config.lang-style'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelMainHeading: {
      alignItems: 'center',
      display: 'flex',
      fontSize: '1.5em',
      '& > svg': {
        fill: theme.palette.text.secondary,
        fontSize: '0.75em',
        marginRight: '0.25em',
      },
    },
  })
)

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const symbLabelState = useSymbAndLabelState()
  const symbLabelDispatch = useLabelAndSymbDispatch()
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()
  const [data, setData] = useState<LangRecordSchema[]>([])
  const elemID = 'filters-panel'
  const { activeSymbGroupID, legendItems } = symbLabelState

  useEffect((): void => {
    initLegend(symbLabelDispatch, activeSymbGroupID, symbLayers)
  }, [activeSymbGroupID, symbLabelDispatch])

  useEffect((): void => setData(state.langFeatures), [state.langFeatures])

  return (
    <>
      {/* TODO: confirm this is actually working. Seemed to break Details. */}
      {/* TODO: wire this back up here and anywhere else that needs it */}
      {/* ...and rm all places that don't */}
      {state.panelState === 'default' && <ScrollToTopOnMount elemID={elemID} />}
      <div className={panelRootClasses.root}>
        <Typography
          className={classes.panelMainHeading}
          variant="h4"
          component="h2"
          id={elemID}
        >
          <GoSearch />
          Search language communities
        </Typography>
        <SearchByOmnibox data={data} />
        <FiltersWarning />
        <LegendPanel legendItems={legendItems} groupName={activeSymbGroupID} />
      </div>
    </>
  )
}
