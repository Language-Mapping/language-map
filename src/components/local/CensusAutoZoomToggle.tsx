import React, { FC } from 'react'
import { Switch } from '@material-ui/core'

import { CustomFormControl } from 'components/legend'
import { useMapToolsDispatch, useMapToolsState } from 'components/context'

// Decides whether to auto-zoom to initial extent on Census language change
export const CensusAutoZoomToggle: FC = (props) => {
  const mapToolsDispatch = useMapToolsDispatch()
  const { autoZoomCensus } = useMapToolsState()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    mapToolsDispatch({ type: 'TOGGLE_CENSUS_AUTO_ZOOM' })
  }

  return (
    <CustomFormControl
      label="Auto-zoom to initial extent"
      switchControl={
        <Switch
          checked={autoZoomCensus}
          onChange={handleChange}
          name="toggle-census-auto-zoom"
          size="small"
        />
      }
    />
  )
}
