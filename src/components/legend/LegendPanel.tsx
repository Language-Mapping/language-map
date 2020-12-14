import React, { FC, useState } from 'react'
import { Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { ToggleableSection } from 'components/generic'
import { WorldRegionMap } from './WorldRegionMap'
import * as Types from './types'
import * as hooks from './hooks'
import { legendConfig } from './config'

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
    // Looks PERFECT on all breakpoints for World Region
    groupedLegend: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumnGap: 4,
      // This doesn't affect Size/Status
      gridTemplateAreas: `
          "reg reg"
          "reg reg"
          "aus aus"
          `,
      // Aus/NZ takes up more space
      '& > :last-child': {
        gridArea: 'aus',
      },
      [theme.breakpoints.only('sm')]: {
        gridTemplateColumns:
          'repeat(4, [col-start] minmax(100px, 1fr) [col-end])',
      },
    },
  })
)

export const LegendPanel: FC<Types.LegendPanelProps> = (props) => {
  const { activeGroupName } = props
  const classes = useStyles()
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false)
  const settings = legendConfig[activeGroupName]
  const { error, data } = hooks.useLegend(
    legendConfig[activeGroupName],
    activeGroupName
  )

  if (error)
    return <p>Something went wrong setting up the {activeGroupName} legend.</p>

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
      {activeGroupName === 'World Region' && (
        <>
          {LegendTip}
          {WorldMap}
        </>
      )}
      <div className={classes.groupedLegend}>
        {data.map((item) => (
          <Legend
            key={item.groupName}
            routeName={settings.routeable ? activeGroupName : undefined}
            groupName={item.groupName}
            items={item.items}
          />
        ))}
      </div>
    </div>
  )
}
