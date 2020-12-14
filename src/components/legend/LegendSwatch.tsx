import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'

import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legendSwatchRoot: {
      alignItems: 'center',
      display: 'grid',
      gridTemplateColumns: 'minmax(1em, auto) 1fr',
      gridColumnGap: '0.24em',
      justifyItems: 'center',
      color: theme.palette.text.primary,
      marginBottom: (props: { isCircle: boolean }) =>
        props.isCircle ? 0 : theme.spacing(1),
    },
    legendLabel: {
      justifySelf: 'flex-start',
      fontSize: theme.typography.caption.fontSize,
      lineHeight: theme.typography.caption.lineHeight,
    },
    imgSwatch: {
      height: 20,
      width: 20,
      marginRight: '0.2em',
    },
  })
)

// No text, no frills. Just a circle with a color
export const SwatchOnly: FC<Types.SwatchOnly> = (props) => {
  const { backgroundColor, size = 7 } = props
  const adjustedSize = Math.round(size * 1.5) // avoid squished circles

  return (
    <span
      style={{
        backgroundColor,
        height: adjustedSize,
        width: adjustedSize,
        borderRadius: '100%',
      }}
    />
  )
}

export const LegendSwatch: FC<Types.LegendSwatchComponent> = (props) => {
  const {
    backgroundColor,
    icon,
    iconID,
    legendLabel,
    size = 7,
    component = 'li',
    labelStyleOverride,
    to,
  } = props
  const isCircle = iconID === '_circle'
  const classes = useStyles({ isCircle })
  // TS freaks out if `to` is a prop and `component` is dynamic
  const muiFriendlyProps = to ? { to } : null

  // NOTE: the styling is pretty fragile in that the non-circle icons must have
  // their colors defined as `fill` within the SVG files themselves. This is
  // fine as long as there are only a handful and the colors are not needed
  // elsewhere. The circles are not using the SVG here but rather (via a weak
  // check for `iconiD_circle`) a simple <span> with a border radius. To be
  // truly portable and consistent, the SVG would need to be brought in as an
  // inline icon so that the fill could be applied via `paint['icon-color']`.

  return (
    <Box
      className={classes.legendSwatchRoot}
      component={component}
      {...muiFriendlyProps}
    >
      {isCircle && <SwatchOnly {...{ size, backgroundColor }} />}
      {!isCircle && (
        <img src={icon} alt={legendLabel} className={classes.imgSwatch} />
      )}
      <Typography
        className={classes.legendLabel}
        style={labelStyleOverride || {}}
      >
        {legendLabel}
      </Typography>
    </Box>
  )
}
