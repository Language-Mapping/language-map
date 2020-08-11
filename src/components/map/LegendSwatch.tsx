import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { LegendSwatchComponent } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendSwatchRoot: {
      display: 'grid',
      gridTemplateColumns: '24px 1fr',
      alignItems: 'center',
      justifyItems: 'center',
      marginBottom: (props: { type: 'symbol' | string }) =>
        props.type === 'symbol' ? theme.spacing(1) : 0,
    },
    swatch: {
      marginRight: theme.spacing(1),
    },
    legendLabel: {
      justifySelf: 'flex-start',
      color: theme.palette.grey[800],
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
  const classes = useStyles({ type })
  const adjustedSize = size * 1.5

  return (
    <li className={classes.legendSwatchRoot}>
      {type === 'circle' && (
        <span
          className={classes.swatch}
          style={{
            backgroundColor,
            height: adjustedSize,
            width: adjustedSize,
            borderRadius: '100%',
          }}
        />
      )}
      {type === 'symbol' && (
        <img
          className={classes.swatch}
          style={{ height: 20, width: 20 }}
          src={icon}
          alt={legendLabel}
        />
      )}
      <Typography variant="caption" className={classes.legendLabel}>
        {legendLabel}
      </Typography>
    </li>
  )
}
