import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { LegendSwatchType } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendSwatchRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    symbol: {
      height: 10,
      width: 10,
      marginRight: theme.spacing(1),
      borderRadius: '100%', // TODO: support other shapes?
    },
  })
)

type LegendType = {
  items: LegendSwatchType[]
}

// TODO: break this out into LegendItem separately since swatch could be handy
// on its own, e.g. in Details or Popup
export const LegendSwatch: FC<LegendSwatchType> = ({
  backgroundColor,
  icon,
  shape = 'circle',
  text,
}) => {
  const classes = useStyles()

  return (
    <li className={classes.legendSwatchRoot}>
      <span className={classes.symbol} style={{ backgroundColor }} />
      {text}
    </li>
  )
}
