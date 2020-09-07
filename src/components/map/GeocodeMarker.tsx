import React, { FC } from 'react'
import { Marker } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { IoIosPin } from 'react-icons/io'

import * as MapTypes from './types'

const ICON_SIZE = 32
const OFFSET = ICON_SIZE / 2

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    markerRoot: {
      color: theme.palette.primary.main,
      fontSize: ICON_SIZE,
    },
    markerLabel: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 4,
      boxShadow: theme.shadows[4],
      color: theme.palette.text.primary,
      fontSize: theme.typography.caption.fontSize,
      left: `calc(-50% + ${ICON_SIZE / 2}px)`,
      maxWidth: 200,
      padding: '4px 8px',
      position: 'relative',
      textAlign: 'center',
      wordWrap: 'break-word',
    },
  })
)

export const GeocodeMarker: FC<MapTypes.GeocodeMarker> = (props) => {
  const { latitude, longitude, text } = props
  const classes = useStyles()

  return (
    <Marker
      {...{ latitude, longitude }}
      className={classes.markerRoot}
      offsetLeft={-1 * OFFSET}
      offsetTop={-1 * ICON_SIZE}
    >
      <Typography className={classes.markerLabel}>{text}</Typography>
      <IoIosPin />
    </Marker>
  )
}
