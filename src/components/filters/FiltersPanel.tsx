import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { ClearFiltersBtn } from 'components/filters'
import { GlobalContext, LoadingIndicator } from 'components'
import { LegendPanel } from 'components/legend'
import { ViewResultsDataBtn } from 'components/results/ViewResultsDataBtn'
import { SearchByOmnibox } from './SearchByOmnibox'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelSubheading: {
      marginBottom: 0,
    },
  })
)
export const FiltersPanel: FC = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length || !state.mapLoaded) {
    return <LoadingIndicator />
  }

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <Typography
        variant="h5"
        component="h3"
        className={classes.panelSubheading}
      >
        Search & Filter
      </Typography>
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
      <Typography variant="h5" component="h3">
        Legend
      </Typography>
      <LegendPanel legendItems={state.legendItems} />
    </>
  )
}
