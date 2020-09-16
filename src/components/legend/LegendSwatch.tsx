import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'

import { LegendSwatchComponent } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendSwatchRoot: {
      alignItems: 'center',
      display: 'grid',
      gridTemplateColumns: 'minmax(1em, auto) 1fr',
      gridColumnGap: '0.24em',
      justifyItems: 'center',
      marginBottom: (props: { type: 'symbol' | string }) =>
        props.type === 'symbol' ? theme.spacing(1) : 0,
    },
    legendLabel: {
      justifySelf: 'flex-start',
    },
    imgSwatch: {
      height: 20,
      width: 20,
      marginRight: '0.2em',
    },
  })
)

// TODO: break this out into LegendItem separately since swatch could be handy
// on its own, e.g. in Details or Popup
export const LegendSwatch: FC<LegendSwatchComponent> = (props) => {
  const {
    backgroundColor,
    icon,
    type,
    legendLabel,
    size = 7,
    component = 'li',
  } = props
  const classes = useStyles({ type })
  const adjustedSize = size * 1.5

  // TODO: make it work
  return (
    <Box className={classes.legendSwatchRoot} component={component}>
      {type === 'circle' && (
        <span
          style={{
            backgroundColor,
            height: adjustedSize,
            width: adjustedSize,
            borderRadius: '100%',
          }}
        />
      )}
      <img src={icon} alt={legendLabel} className={classes.imgSwatch} />
      <Typography variant="caption" className={classes.legendLabel}>
        {legendLabel}
      </Typography>
    </Box>
  )
}
