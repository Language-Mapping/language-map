import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { MapPopup as MapPopupType } from './types'

type MapPopupComponent = MapPopupType & {
  setPopupOpen: React.Dispatch<MapPopupType | null>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPopupRoot: {
      textAlign: 'center',
      minWidth: 150,
      '& .mapboxgl-popup-content': {
        // Leave room for "x" close button
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      },
      '& .mapboxgl-popup-close-button': {
        fontSize: 16,
        padding: 0,
        margin: 0,
        lineHeight: '16px',
        top: 2,
        right: 4,
        color: theme.palette.grey[600],
      },
    },
    heading: {
      lineHeight: 1.2,
    },
    subHeading: {
      fontSize: theme.typography.caption.fontSize,
      fontStyle: 'italic',
    },
  })
)

export const MapPopup: FC<MapPopupComponent> = ({
  longitude,
  latitude,
  setPopupOpen,
  selFeatAttribs,
}) => {
  const classes = useStyles()

  // NOTE: the longest legit language or endonym so far is:
  // Cameroonian Pidgin English

  return (
    <Popup
      tipSize={10}
      anchor="bottom"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false} // TODO: fix this madness
      className={classes.mapPopupRoot}
      onClose={() => setPopupOpen(null)}
    >
      <header>
        <Typography variant="h6" component="h3" className={classes.heading}>
          {selFeatAttribs['Endonym' || 'Language']}
        </Typography>
        {selFeatAttribs.Neighborhoods && (
          <small className={classes.subHeading}>
            {selFeatAttribs.Neighborhoods.split(', ')}
          </small>
        )}
      </header>
    </Popup>
  )
}
