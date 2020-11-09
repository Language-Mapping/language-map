import React, { FC, useState } from 'react'
import { Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components'
import { WorldRegionMap } from './WorldRegionMap'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '1em',
    },
    legendCtrls: {
      alignItems: 'center',
      display: 'flex',
      margin: '0.25em 0 0.75em',
      '& > * + *': {
        marginLeft: '1em',
      },
    },
    legendTip: {
      color: theme.palette.text.secondary,
      fontSize: '0.65em',
      marginTop: '1.75em',
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
    <Typography className={classes.legendTip}>
      Click any world region below to see languages from that region which are
      spoken locally. {WorldMapToggle}
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
