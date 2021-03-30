import React, { FC } from 'react'
import { Route, useParams, Switch } from 'react-router-dom'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { InstanceLevelSchema } from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import { MapPopupProps, SetShowPopupsProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPopupRoot: {
      textAlign: 'center',
      minWidth: 150,
      // Shaky but makes long endos like Church Slavonic's fit. Safari and/or
      // Firefox seem to need more room than Chrome.
      maxWidth: 270,
      wordWrap: 'break-word',
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
    // FROM TOOLTIP // TODO: rm if not using, otherwise incorporate
    // mapTooltipRoot: {
    //   textAlign: 'center',
    //   '& .mapboxgl-popup-content': { padding: 6 },
    // },
    // subheading: { display: 'block', fontStyle: 'italic', fontSize: 12 },
  })
)

export const MapPopup: FC<MapPopupProps> = (props) => {
  const classes = useStyles()
  const { longitude, latitude, setShowPopups, heading, subheading } = props
  const { mapPopupRoot, popupHeading, subHeading } = classes

  return (
    <Popup
      tipSize={10}
      longitude={longitude}
      latitude={latitude}
      className={mapPopupRoot}
      onClose={() => {
        setShowPopups(false)
      }}
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

const LanguagePopup: FC<SetShowPopupsProps> = (props) => {
  const { setShowPopups } = props
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useAirtable<InstanceLevelSchema>('Data', {
    fields: ['Language', 'Endonym', 'Latitude', 'Longitude'],
    filterByFormula: `{id} = ${id}`,
    maxRecords: 1,
  })

  if (isLoading || error || !data.length) return <></>

  const { Language, Endonym, Latitude, Longitude } = data[0]

  return (
    <MapPopup
      longitude={Longitude}
      latitude={Latitude}
      setShowPopups={setShowPopups}
      heading={Endonym}
      subheading={Language}
    />
  )
}

export type NeighborhoodTableSchema = {
  name: string
  County: string // or NYC borough
  x_max: number
  x_min: number
  y_min: number
  y_max: number
}

const NeighborhoodPopup: FC<SetShowPopupsProps> = (props) => {
  const { setShowPopups } = props
  const { name } = useParams<{ name: string }>()

  const { data, isLoading, error } = useAirtable<NeighborhoodTableSchema>(
    'Neighborhood',
    {
      fields: ['name', 'County', 'x_max', 'x_min', 'y_min', 'y_max'],
      filterByFormula: `{name} = "${name}"`,
      maxRecords: 1,
    }
  )

  if (isLoading || error || !data.length) return <></>

  const {
    County: county, // or borough
    x_max: xMax,
    x_min: xMin,
    y_min: yMin,
    y_max: yMax,
  } = data[0]

  const latitude = (yMax - yMin) / 2 + yMin
  const longitude = (xMin - xMax) / 2 + xMax

  return (
    <MapPopup
      longitude={longitude}
      latitude={latitude}
      setShowPopups={setShowPopups}
      heading={name}
      subheading={county}
    />
  )
}

export const MapPopups: FC<SetShowPopupsProps> = (props) => {
  const { setShowPopups } = props

  return (
    <Switch>
      <Route path="/Explore/Language/:language/:id" exact>
        <LanguagePopup setShowPopups={setShowPopups} />
      </Route>
      <Route path="/Explore/Neighborhood/:name" exact>
        <NeighborhoodPopup setShowPopups={setShowPopups} />
      </Route>
    </Switch>
  )
}
