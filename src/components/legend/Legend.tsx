import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { LegendSwatch } from 'components/legend'
import { langTypeIconsConfig } from 'components/map/config'
import { paths as routes } from 'components/config/routes'
import { LegendComponent, WorldRegionLegend, GroupedLegendProps } from './types'
import { worldRegionLegend } from './config'

const groupedLegendConfigs = {
  'World Region': worldRegionLegend,
} as { [key: string]: WorldRegionLegend }

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      listStyleType: 'none',
      marginBottom: theme.spacing(1),
      marginTop: 0,
      paddingLeft: 0,
    },
    // Looks PERFECT on all breakpoints
    groupedLegend: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
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
  })
)

// TODO: make RouterLinks work for `Size`
export const GroupedLegend: FC<GroupedLegendProps> = (props) => {
  const { groupName, legendItems, groupConfig, baseRoute } = props
  const classes = useStyles()

  return (
    <div>
      <Typography component="h4" variant="overline">
        {groupName}
      </Typography>
      <ul className={classes.root}>
        {/* @ts-ignore */}
        {groupConfig[groupName].map((item) => {
          const corresponding = legendItems.find(
            ({ legendLabel }) => legendLabel === item
          )

          if (!corresponding) return <li key={item}>Not found: {item}</li>

          let matchingConfig

          if (corresponding.iconID) {
            matchingConfig = langTypeIconsConfig.find(
              (icon) => icon.id === corresponding.iconID
            )
          }

          return (
            <LegendSwatch
              key={corresponding.legendLabel}
              {...corresponding}
              legendLabel={corresponding.legendLabel}
              icon={matchingConfig && matchingConfig.icon}
              to={`${baseRoute}/${corresponding.legendLabel}`}
              component={RouterLink}
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
        {Object.keys(groupConfig).map((groupHeading) => (
          <GroupedLegend
            key={groupHeading}
            groupName={groupHeading}
            baseRoute={`${routes.grid}/${groupName}`}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            groupConfig={groupConfig}
            legendItems={legendItems}
          />
        ))}
      </div>
    )
  }

  return (
    <ul
      className={classes.root}
      style={{ paddingLeft: groupName === 'Status' ? '0.25em' : 0 }}
    >
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
            component={item.to ? RouterLink : 'li'}
          />
        )
      })}
    </ul>
  )
}
