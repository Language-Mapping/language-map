import React, { FC, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'

import { GlobalContext, LoadingIndicator } from 'components'
import { LegendPanel } from 'components/legend'
import { RouteLocation } from 'components/map/types'

export const FiltersPanel: FC = () => {
  const { state } = useContext(GlobalContext)
  const loc = useLocation()
  const history = useHistory()

  // Shaky check to see if features have loaded and are stored globally
  if (!state.langFeaturesCached.length || !state.mapLoaded) {
    return <LoadingIndicator />
  }

  const DATA_TABLE_PATH: RouteLocation = '/table'

  // TODO: for Countries selection:
  // https://material-ui.com/components/autocomplete/#country-select
  return (
    <>
      <Button
        // TODO: <RouterLink> instead
        onClick={() => history.push(`${DATA_TABLE_PATH}${loc.search}`)}
        color="primary"
        size="small"
        variant="contained"
        startIcon={<TiThList />}
      >
        View data table
      </Button>
      <LegendPanel legendItems={state.legendItems} />
    </>
  )
}
