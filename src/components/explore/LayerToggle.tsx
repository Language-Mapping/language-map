import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Switch } from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'

type LayerToggleProps = {
  layerID: 'counties' | 'neighborhoods'
}

const useStyles = makeStyles((theme: Theme) =>
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
    // wowww overkill, but it fits...
    hideOnMobile: {
      whiteSpace: 'pre',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
)

// TODO: make generic for Counties, etc. These are dynamic:
// showNeighbs, TOGGLE_NEIGHBORHOODS_LAYER
export const LayerToggle: FC<LayerToggleProps> = (props) => {
  const { layerID } = props
  const classes = useStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const mapToolsState = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  let checked

  if (layerID === 'counties') checked = mapToolsState.showCounties
  else if (layerID === 'neighborhoods') checked = mapToolsState.showNeighbs

  const handleNeighborhoodsToggle = () => {
    let dispatchType = 'TOGGLE_NEIGHBORHOODS_LAYER'
    if (layerID === 'counties') dispatchType = 'TOGGLE_COUNTIES_LAYER'

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // nnnnnnot today, thanks
    mapToolsDispatch({ type: dispatchType })
  }

  const ControlLabel = (
    <div className={classes.controlLabel}>
      Show {layerID} <span className={classes.hideOnMobile}> in map</span>
    </div>
  )

  return (
    <FormControlLabel
      classes={{ label: smallerText, root: switchFormCtrlRoot }}
      control={
        <Switch
          checked={checked}
          onChange={handleNeighborhoodsToggle}
          name="show-neighbs-switch"
          size="small"
        />
      }
      label={ControlLabel}
    />
  )
}
