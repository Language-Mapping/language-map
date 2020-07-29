import React, { FC } from 'react'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { LongLatType } from './types'
import { LangRecordSchema } from '../../context/types'

type PopupComponentType = LongLatType & {
  popupOpen: boolean
  setPopupOpen: React.Dispatch<boolean>
  popupAttribs: LangRecordSchema
}

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

export const MapPopup: FC<PopupComponentType> = ({
  longitude,
  latitude,
  setPopupOpen,
  popupAttribs,
}) => {
  const classes = useStyles()

  // NOTE: the longest legit language or endonym so far is 27 characters:
  // English, Cameroonian Pidgin

  return (
    <Popup
      tipSize={15}
      anchor="top"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false} // TODO: fix this madness
      className={classes.root}
      onClose={() => setPopupOpen(false)}
    >
      <header>
        <Typography variant="h6" component="h3" className={classes.heading}>
          {popupAttribs['Endonym' || 'Language']}
        </Typography>
        {popupAttribs.Neighborhood && (
          <small className={classes.subHeading}>
            {popupAttribs.Neighborhood}
          </small>
        )}
      </header>
    </Popup>
  )
}
