import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { LegendSwatch } from 'components/legend'
import { langTypeIconsConfig } from 'components/map/config'
import { LegendComponent, WorldRegionLegend } from './types'
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
  })
)

export const Legend: FC<LegendComponent> = (props) => {
  const { legendItems, groupName } = props
  const classes = useStyles()
  const groupConfig = groupedLegendConfigs[groupName as string]

  if (groupConfig) {
    return (
      <>
        {Object.keys(groupConfig).map((groupHeading) => {
          return (
            <>
              <Typography>{groupHeading}</Typography>
              <ul>
                {/* @ts-ignore */}
                {groupConfig[groupHeading].map((item) => {
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
                      icon={corresponding && corresponding.icon}
                    />
                  )
                })}
              </ul>
            </>
          )
        })}
      </>
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
