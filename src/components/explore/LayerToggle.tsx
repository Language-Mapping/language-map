import React, { FC } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { FormControlLabel, Switch } from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'

export const useLocalPanelStyles = makeStyles(() =>
  createStyles({
    switchFormCtrlRoot: {
      marginLeft: 0,
    },
    controlLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    smallerText: {
      fontSize: '0.8rem',
    },
  })
)

// TODO: make generic for Counties, etc. These are dynamic:
// showNeighbs, TOGGLE_NEIGHBORHOODS_LAYER
export const LayerToggle: FC = (props) => {
  const classes = useLocalPanelStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const { showNeighbs } = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()

  const handleNeighborhoodsToggle = () => {
    mapToolsDispatch({
      type: 'TOGGLE_NEIGHBORHOODS_LAYER',
    })
  }

  const ControlLabel = (
    <div className={classes.controlLabel}>Show neighborhoods</div>
  )

  return (
    <FormControlLabel
      classes={{ label: smallerText, root: switchFormCtrlRoot }}
      control={
        <Switch
          checked={showNeighbs}
          onChange={handleNeighborhoodsToggle}
          name="show-neighbs-switch"
          size="small"
        />
      }
      label={ControlLabel}
    />
  )
}
