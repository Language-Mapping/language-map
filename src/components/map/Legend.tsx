import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LegendSwatch } from 'components/map'
import { LegendSwatchComponent } from './types'
import { langTypeIconsConfig } from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendRoot: {
      listStyleType: 'none',
      paddingLeft: theme.spacing(2),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
)

type LegendType = {
  items: LegendSwatchComponent[]
}

export const Legend: FC<LegendType> = ({ items }) => {
  const classes = useStyles()

  return (
    <ul className={classes.legendRoot}>
      {items.map((item) => {
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
