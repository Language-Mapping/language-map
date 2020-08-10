import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { MapPopupType } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      width: 200,
      '& a[role="button"]': {
        color: theme.palette.common.white,
      },
      '& .mapboxgl-popup-content': {
        padding: theme.spacing(1),
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

type MapPopupComponentType = MapPopupType & {
  setPopupOpen: React.Dispatch<MapPopupType | null>
}

export const MapPopup: FC<MapPopupComponentType> = ({
  longitude,
  latitude,
  setPopupOpen,
  selFeatAttribs,
}) => {
  const classes = useStyles()

  // NOTE: the longest legit language or endonym so far is 27 characters:
  // English, Cameroonian Pidgin

  return (
    <Popup
      tipSize={15}
      anchor="bottom"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false} // TODO: fix this madness
      className={classes.root}
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
