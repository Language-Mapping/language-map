import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LegendSwatchType } from './types'

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
export const LegendSwatch: FC<LegendSwatchType> = ({
  backgroundColor,
  icon,
  shape = 'circle',
  text,
  size = 7,
}) => {
  const classes = useStyles()
  const adjustedSize = size * 1.5

  return (
    <li className={classes.legendSwatchRoot}>
      <span
        className={classes.symbol}
        style={{
          backgroundColor,
          height: adjustedSize,
          width: adjustedSize,
          borderRadius: shape === 'circle' ? '100%' : 'unset',
        }}
      />
      <span style={{ justifySelf: 'flex-start' }}>{text}</span>
    </li>
  )
}
