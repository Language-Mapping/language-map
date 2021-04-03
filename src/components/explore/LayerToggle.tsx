import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Switch } from '@material-ui/core'

import { useMapToolsState, useMapToolsDispatch } from 'components/context'

type LayerToggleProps = {
  layerID: 'counties' | 'neighborhoods'
  text?: string
  excludeWrap?: boolean // e.g. if it's inline w/share btns
  terse?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    switchFormCtrlRoot: {
      margin: 0,
    },
    controlLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    smallerText: {
      fontSize: '0.75rem',
    },
    // wowww overkill, but it fits...
    hideOnMobile: {
      whiteSpace: 'pre',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    wrap: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
)

// TODO: make generic for Counties, etc. These are dynamic:
// showNeighbs, TOGGLE_NEIGHBORHOODS_LAYER
export const LayerToggle: FC<LayerToggleProps> = (props) => {
  const { layerID, text, excludeWrap, terse } = props
  const classes = useStyles()
  const { smallerText, switchFormCtrlRoot } = classes
  const mapToolsState = useMapToolsState()
  const mapToolsDispatch = useMapToolsDispatch()
  let checked

  if (layerID === 'counties') checked = mapToolsState.showCounties
  else if (layerID === 'neighborhoods') checked = mapToolsState.showNeighbs

  const handleToggle = () => {
    let dispatchType = 'TOGGLE_NEIGHBORHOODS_LAYER'
    if (layerID === 'counties') dispatchType = 'TOGGLE_COUNTIES_LAYER'

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // nnnnnnot today, thanks
    mapToolsDispatch({ type: dispatchType })
  }

  const ControlLabel = (
    <div className={classes.controlLabel}>
      Show {text || layerID}{' '}
      {!terse && <span className={classes.hideOnMobile}> in map</span>}
    </div>
  )

  const TheToggle = (
    <FormControlLabel
      classes={{ label: smallerText, root: switchFormCtrlRoot }}
      control={
        <Switch
          checked={checked}
          onChange={handleToggle}
          name="show-neighbs-switch"
          size="small"
        />
      }
      label={ControlLabel}
    />
  )

  if (excludeWrap) return TheToggle

  return <div className={classes.wrap}>{TheToggle}</div>
}
