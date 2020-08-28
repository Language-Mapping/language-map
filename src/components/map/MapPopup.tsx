import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { MapPopup as MapPopupType } from './types'
import { isURL, prettyTruncateList } from '../../utils'

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
        color: theme.palette.text.hint,
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

export const MapPopup: FC<MapPopupComponent> = (props) => {
  const classes = useStyles()
  const { longitude, latitude, setPopupOpen, selFeatAttribs } = props
  const { mapPopupRoot, heading, subHeading } = classes
  const { Endonym, Language, Neighborhoods } = selFeatAttribs

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
      onClose={() => setPopupOpen(null)}
    >
      <header>
        <Typography variant="h6" component="h3" className={heading}>
          {/* For image-only endos, show language (not much room for pic) */}
          {isURL(Endonym) ? Language : Endonym}
        </Typography>
        {Neighborhoods && (
          <small className={subHeading}>
            {prettyTruncateList(Neighborhoods)}
          </small>
        )}
      </header>
    </Popup>
  )
}
