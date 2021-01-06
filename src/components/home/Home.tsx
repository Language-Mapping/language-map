import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { GoSearch } from 'react-icons/go'

import { LegendPanel } from 'components/legend'
import { usePanelRootStyles } from 'components/panels'
import { useSymbAndLabelState } from 'components/context/SymbAndLabelContext'
import { SearchByOmnibox } from './SearchByOmnibox'
import { FiltersWarning } from './FiltersWarning'

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

export const Home: FC = () => {
  const symbLabelState = useSymbAndLabelState()
  const classes = useStyles()
  const panelRootClasses = usePanelRootStyles()
  const elemID = 'filters-panel'
  const { activeSymbGroupID } = symbLabelState

  return (
    <>
      {/* TODO: confirm this is actually working. Seemed to break Details. */}
      {/* TODO: wire this back up here and anywhere else that needs it */}
      {/* ...and rm all places that don't */}
      {/*
      {state.panelState === 'default' && <ScrollToTopOnMount elemID={elemID} />}
      */}
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
        <SearchByOmnibox />
        <FiltersWarning />
        <LegendPanel activeGroupName={activeSymbGroupID} />
      </div>
    </>
  )
}
