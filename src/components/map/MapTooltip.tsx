import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { MapTooltip as MapTooltipType } from './types'

type MapTooltipComponent = MapTooltipType & {
  setTooltip: React.Dispatch<MapTooltipType | null>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapTooltipRoot: {
      textAlign: 'center',
      '& .mapboxgl-popup-content': {
        padding: 6,
      },
    },
    subHeading: {
      display: 'block',
      fontStyle: 'italic',
      fontSize: 12,
    },
  })
)

export const MapTooltip: FC<MapTooltipComponent> = ({
  longitude,
  latitude,
  heading,
  subHeading,
}) => {
  const classes = useStyles()

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      closeButton={false}
      className={classes.mapTooltipRoot}
    >
      {/* TODO: better/smaller heading styles */}
      <Typography>{heading}</Typography>
      {subHeading && (
        <Typography variant="caption" className={classes.subHeading}>
          {subHeading}
        </Typography>
      )}
    </Popup>
  )
}
