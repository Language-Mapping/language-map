import React, { FC } from 'react'
import { Marker } from 'react-map-gl'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'

import * as MapTypes from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    markerLabel: {
      // Default label color to match default blue pin
      backgroundColor: (props: { subtle?: boolean }) =>
        props.subtle ? theme.palette.background.paper : 'hsl(228deg 87% 61%)',
      borderRadius: 4,
      boxShadow: theme.shadows[4],
      color: theme.palette.text.primary,
      fontSize: theme.typography.caption.fontSize,
      left: '-50%',
      maxWidth: 200,
      padding: '4px 8px',
      position: 'relative',
      textAlign: 'center',
      wordWrap: 'break-word',
    },
  })
)

// Misleading as we're using it for more than just geocoding
export const GeocodeMarker: FC<MapTypes.GeocodeMarkerProps> = (props) => {
  const { latitude, longitude, text, subtle } = props
  const classes = useStyles({ subtle })

  return (
    <Marker latitude={latitude} longitude={longitude} offset={[0, 8]}>
      <Typography className={classes.markerLabel}>{text}</Typography>
    </Marker>
  )
}
