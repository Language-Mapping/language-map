import React, { FC } from 'react'
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button, Typography, Divider } from '@material-ui/core'

import { LongLatType } from './types'
import { LangRecordSchema, ActivePanelRouteType } from '../../context/types'

type PopupComponentType = LongLatType & {
  setPopupOpen: React.Dispatch<boolean>
  selFeatAttribs?: LangRecordSchema
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
  selFeatAttribs = {},
}) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Popup
      tipSize={15}
      anchor="top"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false}
      className={classes.root}
      onClose={() => setPopupOpen(false)}
    >
      <header className={classes.intro}>
        <Typography variant="h4" component="h3">
          {selFeatAttribs['Language Endonym' || 'Language']}
        </Typography>
        {selFeatAttribs['NYC Neighborhood'] && (
          <Typography className={classes.subHeading}>
            <i>Neighborhood: {selFeatAttribs['NYC Neighborhood']}</i>
          </Typography>
        )}
      </header>
      <Divider variant="middle" />
      <p>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            const baseRoute: ActivePanelRouteType = '/details'
            const parsed = queryString.parse(window.location.search)
            const strung = {
              ...parsed,
              id: selFeatAttribs.ID,
            }

            history.push(`${baseRoute}?${queryString.stringify(strung)}`)

            setPopupOpen(false)

            document.title = `${
              selFeatAttribs.Language as string
            } - NYC Languages`
          }}
        >
          View Details
        </Button>
      </p>
    </Popup>
  )
}
