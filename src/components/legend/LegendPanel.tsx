import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LayerSymbSelect, LayerLabelSelect, Legend } from 'components/legend'
import { WorldRegionMap } from './WorldRegionMap'
import * as Types from './types'
import * as hooks from './hooks'

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
  const {
    error,
    data,
    isLoading,
    legendHeading,
    routeable,
    legendSummary,
  } = hooks.useLegend(activeGroupName)

  if (error)
    return <p>Something went wrong setting up the {activeGroupName} legend.</p>

  return (
    <div className={classes.root}>
      <div className={classes.legendCtrls}>
        <LayerSymbSelect />
        <LayerLabelSelect />
      </div>
      {activeGroupName === 'World Region' && <WorldRegionMap />}
      {isLoading && <p>Loading legend info...</p>}
      {!isLoading && (
        <div className={classes.groupedLegend}>
          {data.map((item) => (
            <Legend
              key={item.groupName}
              routeName={routeable ? activeGroupName : undefined}
              groupName={legendHeading || item.groupName}
              legendSummary={legendSummary}
              items={item.items}
            />
          ))}
        </div>
      )}
    </div>
  )
}
