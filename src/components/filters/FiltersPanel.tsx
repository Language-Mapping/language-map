import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { GlobalContext } from 'components'
import { LegendPanel } from 'components/legend'
import { ViewResultsDataBtn } from 'components/results/ViewResultsDataBtn'
import { SearchByOmnibox } from './SearchByOmnibox'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsBtnWrap: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 8,
    },
  })
)

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles()
  const { langSymbGroups, activeLangSymbGroupId } = state
  /* eslint-disable operator-linebreak */
  const groupName = langSymbGroups[activeLangSymbGroupId]
    ? langSymbGroups[activeLangSymbGroupId].name
    : ''
  /* eslint-enable operator-linebreak */

  // TODO: something respectable for styles, aka MUI-something
  return (
    <>
      <SearchByOmnibox
        data={state.langFeatures}
        noFiltersSet={state.langFeatIDs !== null}
      />
      <div className={classes.resultsBtnWrap}>
        <ViewResultsDataBtn />
      </div>
      {state.mapLoaded && (
        <LegendPanel legendItems={state.legendItems} groupName={groupName} />
      )}
    </>
  )
}
