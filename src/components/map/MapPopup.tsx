import React, { FC } from 'react'
import * as queryString from 'query-string'
import { Link as RouteLink } from 'react-router-dom'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Divider } from '@material-ui/core'

import { LongLatType } from './types'
import { LangRecordSchema, ActivePanelRouteType } from '../../context/types'

type PopupComponentType = LongLatType & {
  popupOpen: boolean
  setPopupOpen: React.Dispatch<boolean>
  popupAttribs: LangRecordSchema
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      width: 250,
      [theme.breakpoints.up('sm')]: {
        width: 300,
      },
      '& a[role="button"]': {
        color: theme.palette.common.white,
      },
    },
    intro: {
      paddingBottom: theme.spacing(1),
    },
    subHeading: {
      fontSize: theme.typography.caption.fontSize,
    },
  })
)

export const MapPopup: FC<PopupComponentType> = ({
  longitude,
  latitude,
  setPopupOpen,
  popupAttribs,
  popupOpen,
}) => {
  const classes = useStyles()
  const baseRoute: ActivePanelRouteType = '/details'
  const parsed = queryString.parse(window.location.search)
  const strung = {
    ...parsed,
    id: popupAttribs.ID,
  }

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
      <header className={classes.intro}>
        <Typography variant="h4" component="h3">
          {popupAttribs['Language Endonym' || 'Language']}
        </Typography>
        {popupAttribs['NYC Neighborhood'] && (
          <Typography className={classes.subHeading}>
            <i>Neighborhood: {popupAttribs['NYC Neighborhood']}</i>
          </Typography>
        )}
      </header>
      <Divider variant="middle" />
      <p>
        <RouteLink
          to={`${baseRoute}?${queryString.stringify(strung)}`}
          onClick={() => {
            setPopupOpen(false)
          }}
        >
          View Details
        </RouteLink>
      </p>
    </Popup>
  )
}
