import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LegendSwatchComponent } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendSwatchRoot: {
      display: 'grid',
      gridTemplateColumns: '20px 1fr',
      alignItems: 'center',
      justifyItems: 'center',
    },
    symbol: {
      height: 10,
      width: 10,
      marginRight: theme.spacing(1),
      borderRadius: '100%', // TODO: support other shapes?
    },
  })
)

// TODO: break this out into LegendItem separately since swatch could be handy
// on its own, e.g. in Details or Popup
export const LegendSwatch: FC<LegendSwatchComponent> = ({
  backgroundColor,
  icon,
  type,
  legendLabel,
  size = 7,
}) => {
  const classes = useStyles()
  const adjustedSize = size * 1.5

  return (
    <li className={classes.legendSwatchRoot}>
      {type === 'circle' && (
        <span
          className={classes.symbol}
          style={{
            backgroundColor,
            height: adjustedSize,
            width: adjustedSize,
            borderRadius: '100%',
          }}
        />
      )}
      {type === 'symbol' && icon}
      <span style={{ justifySelf: 'flex-start' }}>{legendLabel}</span>
    </li>
  )
}
