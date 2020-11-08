import React, { FC, useState } from 'react'
import { Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components'
import { GoInfo } from 'react-icons/go'
import { WorldRegionMap } from './WorldRegionMap'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '1.25em',
    },
    legendCtrls: {
      margin: '0.25em 0 0.75em',
      display: 'flex',
      alignItems: 'center',
      '& > * + *': {
        marginLeft: '1em',
      },
    },
    worldMapToggle: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      display: 'flex',
      fontSize: '0.65em',
      marginTop: '1em',
      '& svg': {
        marginRight: '0.5em',
        fontSize: '1.2em',
      },
    },
  })
)

export const LegendPanel: FC<Types.LegendPanelComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)

  const WorldMapToggle = (
    <Link
      href="#"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        setShowWorldMap(!showWorldMap)
      }}
    >
      {showWorldMap ? 'Hide' : 'Show'} world map
    </Link>
  )

  const LegendTip = (
    <Typography className={classes.worldMapToggle}>
      <GoInfo />
      <span>
        Click any world region below to see languages from that region which are
        spoken locally. {WorldMapToggle}
      </span>
    </Typography>
  )

  const WorldMap = (
    <ToggleableSection show={showWorldMap}>
      <WorldRegionMap />
    </ToggleableSection>
  )

  return (
    <div className={classes.root}>
      <div className={classes.legendCtrls}>
        <LayerSymbSelect />
        <LayerLabelSelect />
      </div>
      {groupName === 'World Region' && (
        <>
          {LegendTip}
          {WorldMap}
        </>
      )}
      <Legend legendItems={legendItems} groupName={groupName} />
    </div>
  )
}
