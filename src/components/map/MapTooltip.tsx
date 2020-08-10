import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { MapTooltipType } from './types'

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

type MapTooltipComponentType = MapTooltipType & {
  setTooltipOpen: React.Dispatch<MapTooltipType | null>
}

export const MapTooltip: FC<MapTooltipComponentType> = ({
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
      <Typography>{heading}</Typography>
      {subHeading && (
        <Typography variant="caption" className={classes.subHeading}>
          {subHeading}
        </Typography>
      )}
    </Popup>
  )
}
