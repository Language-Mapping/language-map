import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { LegendSwatch } from 'components/legend'
import { langTypeIconsConfig } from 'components/map/config'
import { LegendComponent, WorldRegionLegend, GroupedLegendProps } from './types'
import { worldRegionLegend } from './config'

const groupedLegendConfigs = {
  'World Region': worldRegionLegend,
} as { [key: string]: WorldRegionLegend }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendRoot: {
      listStyleType: 'none',
      marginBottom: theme.spacing(1),
      marginTop: 0,
      paddingLeft: 4,
    },
    // Looks PERFECT on all breakpoints
    groupedLegend: {
      display: 'grid',
      marginTop: theme.spacing(2),
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRow: 'auto auto 1fr',
      gridColumnGap: 4,
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
    groupedLegendHeading: {
      color: theme.palette.grey[800],
      fontSize: '1.2rem',
      marginBottom: '.2rem',
    },
  })
)

export const GroupedLegend: FC<GroupedLegendProps> = (props) => {
  const { groupName, legendItems, groupConfig } = props
  const classes = useStyles()

  return (
    <div>
      <Typography
        component="h4"
        variant="h3"
        className={classes.groupedLegendHeading}
      >
        {groupName}
      </Typography>
      <ul className={classes.legendRoot}>
        {/* @ts-ignore */}
        {groupConfig[groupName].map((item) => {
          const corresponding = legendItems.find(
            ({ legendLabel }) => legendLabel === item
          )

          if (!corresponding) {
            return <li key={item}>Not found: {item}</li>
          }

          return (
            <LegendSwatch
              key={corresponding.legendLabel}
              {...corresponding}
              legendLabel={corresponding.legendLabel}
              icon={corresponding && corresponding.icon}
            />
          )
        })}
      </ul>
    </div>
  )
}

export const Legend: FC<LegendComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const groupConfig = groupedLegendConfigs[groupName as string]

  if (groupConfig) {
    return (
      <div className={classes.groupedLegend}>
        {Object.keys(groupConfig).map((groupHeading) => {
          return (
            <GroupedLegend
              key={groupHeading}
              groupName={groupHeading}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              groupConfig={groupConfig}
              legendItems={legendItems}
            />
          )
        })}
      </div>
    )
  }

  return (
    <ul className={classes.legendRoot}>
      {legendItems.map((item) => {
        let matchingConfig

        if (item.iconID) {
          matchingConfig = langTypeIconsConfig.find(
            (icon) => icon.id === item.iconID
          )
        }

        return (
          <LegendSwatch
            key={item.legendLabel}
            {...item}
            icon={matchingConfig && matchingConfig.icon}
          />
        )
      })}
    </ul>
  )
}
