import React, { FC } from 'react'
import { Route, useParams, Switch } from 'react-router-dom'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { InstanceLevelSchema } from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import {
  MapPopupProps,
  MapPopupsProps,
  NeighborhoodTableSchema,
  PolygonPopupProps,
} from './types'

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

const LanguagePopup: FC<Pick<MapPopupsProps, 'setShowPopups'>> = (props) => {
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

const PolygonPopup: FC<PolygonPopupProps> = (props) => {
  const {
    setShowPopups,
    tableName,
    baseID,
    subHeadingField,
    uniqueIDfield = 'name',
    addlFields = [],
  } = props
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useAirtable<NeighborhoodTableSchema>(
    tableName,
    {
      fields: ['x_max', 'x_min', 'y_min', 'y_max', ...addlFields],
      filterByFormula: `{${uniqueIDfield}} = "${id}"`,
      maxRecords: 1,
      ...(baseID && { baseID }),
    }
  )

  if (isLoading || error || !data.length) return <></>

  const { x_max: xMax, x_min: xMin, y_min: yMin, y_max: yMax } = data[0]

  const latitude = (yMax - yMin) / 2 + yMin
  const longitude = (xMin - xMax) / 2 + xMax

  return (
    <MapPopup
      longitude={longitude}
      latitude={latitude}
      setShowPopups={setShowPopups}
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      heading={data[0][uniqueIDfield]}
      // @ts-ignore
      subheading={data[0][subHeadingField]}
      /* eslint-enable @typescript-eslint/ban-ts-comment */
    />
  )
}

export const MapPopups: FC<MapPopupsProps> = (props) => {
  const { setShowPopups } = props

  return (
    <Switch>
      <Route path="/Explore/Language/:language/:id" exact>
        <LanguagePopup setShowPopups={setShowPopups} />
      </Route>
      <Route path="/Explore/Neighborhood/:id" exact>
        <PolygonPopup
          setShowPopups={setShowPopups}
          tableName="Neighborhood"
          subHeadingField="County"
          addlFields={['County', 'name']}
        />
      </Route>
      <Route path="/Explore/County/:id" exact>
        <PolygonPopup
          setShowPopups={setShowPopups}
          tableName="County"
          addlFields={['name']}
        />
      </Route>
    </Switch>
  )
}
