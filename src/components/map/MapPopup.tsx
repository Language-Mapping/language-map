import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import * as MapTypes from './types'

type MapPopupComponent = MapTypes.PopupClean & {
  setPopupVisible: React.Dispatch<boolean>
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
        color: theme.palette.text.hint,
      },
    },
    popupHeading: {
      lineHeight: 1.2,
    },
    subHeading: {
      fontSize: theme.typography.caption.fontSize,
      fontStyle: 'italic',
    },
  })
)

export const MapPopup: FC<MapPopupComponent> = (props) => {
  const classes = useStyles()
  const { longitude, latitude, setPopupVisible, heading, subheading } = props
  const { mapPopupRoot, popupHeading, subHeading } = classes

  // NOTE: the longest non-url language or endonym so far is:
  // Cameroonian Pidgin English

  return (
    <Popup
      tipSize={10}
      anchor="bottom"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false} // TODO: fix this madness
      className={mapPopupRoot}
      onClose={() => setPopupVisible(false)}
    >
      <header>
        <Typography variant="h6" component="h3" className={popupHeading}>
          {heading}
        </Typography>
        {subheading && <small className={subHeading}>{subheading}</small>}
      </header>
    </Popup>
  )
}
