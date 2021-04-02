import React, { FC } from 'react'
import { Route, useParams, Switch } from 'react-router-dom'
import { Popup } from 'react-map-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { InstanceLevelSchema, useMapToolsState } from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import { AIRTABLE_CENSUS_BASE } from 'components/config'
import {
  CensusTableRow,
  MapPopupProps,
  MapPopupsProps,
  NeighborhoodTableSchema,
  PolygonPopupProps,
} from './types'
import { getCenterOfBounds } from './utils'

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
    popupContent: {
      fontSize: theme.typography.caption.fontSize,
      // fontStyle: 'italic',
    },
  })
)

// The actual <Popup> component
export const MapPopup: FC<MapPopupProps> = (props) => {
  const classes = useStyles()
  const { longitude, latitude, setShowPopups, heading, content } = props
  const { mapPopupRoot, popupHeading, popupContent } = classes

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
        {content && <small className={popupContent}>{content}</small>}
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
      content={Language}
    />
  )
}

const PolygonPopup: FC<PolygonPopupProps> = (props) => {
  const { setShowPopups, tableName, addlFields = [] } = props
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useAirtable<NeighborhoodTableSchema>(
    tableName,
    {
      fields: ['name', 'x_max', 'x_min', 'y_min', 'y_max', ...addlFields],
      filterByFormula: `{name} = "${id}"`,
      maxRecords: 1,
    }
  )

  if (isLoading || error || !data.length) return <></>

  const firstResult = data[0]
  const { latitude, longitude } = getCenterOfBounds(data[0])

  return (
    <MapPopup
      longitude={longitude}
      latitude={latitude}
      setShowPopups={setShowPopups}
      heading={firstResult.name}
      content={firstResult.County || ''}
    />
  )
}

const CensusPopup: FC<MapPopupsProps> = (props) => {
  const { setShowPopups } = props
  const { field, id, table } = useParams<{
    id: string
    field: string
    table: 'puma' | 'tract' // TODO: tighten up everywhere
  }>()
  const addlFields = table === 'puma' ? ['Neighborhood'] : []
  const { censusActiveField } = useMapToolsState()

  const { data, isLoading, error } = useAirtable<CensusTableRow>(table, {
    fields: ['GEOID', ...addlFields, 'x_max', 'x_min', 'y_min', 'y_max', field],
    filterByFormula: `{GEOID} = "${id}"`,
    maxRecords: 1,
    baseID: AIRTABLE_CENSUS_BASE,
  })

  if (isLoading || error || !data.length) return <></>

  const firstResult = data[0]
  const { latitude, longitude } = getCenterOfBounds(firstResult)
  let content = ''

  const heading = `${firstResult[field]} ${
    censusActiveField?.pretty || field
  } speakers`

  if (table === 'puma') {
    content = `in ${firstResult.Neighborhood}`
  } else if (table === 'tract') {
    content = 'in this census tract'
  }

  return (
    <MapPopup
      longitude={longitude}
      latitude={latitude}
      setShowPopups={setShowPopups}
      heading={heading}
      content={content}
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
      <Route path="/Census/:table/:field/:id" exact>
        <CensusPopup setShowPopups={setShowPopups} />
      </Route>
    </Switch>
  )
}
