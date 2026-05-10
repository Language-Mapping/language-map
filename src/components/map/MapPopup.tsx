import React, { FC } from 'react'
import { Route, useParams, Routes } from 'react-router-dom'
import { Popup } from 'react-map-gl'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography } from '@mui/material'

import { InstanceLevelSchema, useMapToolsState } from 'components/context'
import { useAirtable } from 'components/explore/hooks'
import { AIRTABLE_CENSUS_BASE } from 'components/config'
import { routes } from 'components/config/api'
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
    root: {
      textAlign: 'center',
      minWidth: 175,
      maxWidth: 275,
      wordWrap: 'break-word',
      '& .mapboxgl-popup-content': {
        // Leave room for "x" close button
        padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
      },
      '& .mapboxgl-popup-close-button': {
        fontSize: '1.25rem',
        padding: 0,
        margin: 0,
        lineHeight: 1,
        top: 0,
        right: 8,
        color: theme.palette.text.primary,
      },
    },
    popupHeading: {
      color: theme.palette.text.primary,
      lineHeight: 1.2,
    },
    popupContent: {
      marginTop: '0.25rem', // `marginBottom` on heading not good if no content
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      margin: 0,
    },
  })
)

// The actual <Popup> component
export const MapPopup: FC<MapPopupProps> = (props) => {
  const classes = useStyles()
  const { longitude, latitude, handleClose, heading, content } = props
  const { root, popupHeading, popupContent } = classes

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      className={root}
      onClose={handleClose}
    >
      <header>
        <Typography variant="h6" component="h3" className={popupHeading}>
          {heading}
        </Typography>
        {content ? <p className={popupContent}>{content}</p> : null}
      </header>
    </Popup>
  )
}

const LanguagePopup: FC<Pick<MapPopupsProps, 'handleClose'>> = (props) => {
  const { handleClose } = props
  const { id = '' } = useParams() as { id: string }

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
      handleClose={handleClose}
      heading={Endonym}
      content={Language !== Endonym && Language}
    />
  )
}

const PolygonPopup: FC<PolygonPopupProps> = (props) => {
  const { handleClose, tableName, addlFields = [] } = props
  const { id = '' } = useParams() as { id: string }

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
      handleClose={handleClose}
      heading={firstResult.name}
      content={firstResult.County || ''}
    />
  )
}

const CensusPopup: FC<MapPopupsProps> = (props) => {
  const { handleClose } = props
  const { field = '', id = '', table = 'tract' } = useParams() as {
    id: string
    field: string
    table: 'puma' | 'tract' // TODO: tighten up everywhere
  }
  const addlFields = table === 'puma' ? ['Neighborhood'] : []
  const { censusActiveField } = useMapToolsState()

  const { data, isLoading, error } = useAirtable<CensusTableRow>(table, {
    fields: ['GEOID', ...addlFields, 'x_max', 'x_min', 'y_min', 'y_max', field],
    filterByFormula: `{GEOID} = "${id}"`,
    maxRecords: 1,
    baseID: AIRTABLE_CENSUS_BASE,
  })

  const { data: prettyData } = useAirtable<{
    pretty: string
  }>(
    'Census',
    {
      fields: ['pretty'],
      filterByFormula: `{id} = "${field}"`,
      maxRecords: 1,
    },
    { enabled: !censusActiveField?.pretty }
  )

  if (isLoading || error || !data.length) return <></>

  const firstRow = data[0]
  const { latitude, longitude } = getCenterOfBounds(firstRow)
  const heading = firstRow[field] ? firstRow[field].toLocaleString() : 'No'

  const Content = (
    <>
      of{' '}
      <i>
        {censusActiveField?.pretty || prettyData[0]?.pretty || 'this language'}
      </i>{' '}
      in {`${firstRow.Neighborhood || 'this census tract'}`}
    </>
  )

  return (
    <MapPopup
      longitude={longitude}
      latitude={latitude}
      handleClose={handleClose}
      heading={`${heading} speakers`}
      content={Content}
    />
  )
}

export const MapPopups: FC<MapPopupsProps> = (props) => {
  const { handleClose } = props

  return (
    <Routes>
      <Route
        path="/Explore/Language/:language/:id"
        element={<LanguagePopup handleClose={handleClose} />}
      />
      <Route
        path="/Explore/Neighborhood/:id"
        element={
          <PolygonPopup
            handleClose={handleClose}
            tableName="Neighborhood"
            addlFields={['County', 'name']}
          />
        }
      />
      <Route
        path="/Explore/County/:id"
        element={
          <PolygonPopup
            handleClose={handleClose}
            tableName="County"
            addlFields={['name']}
          />
        }
      />
      <Route
        path={routes.censusDetail}
        element={<CensusPopup handleClose={handleClose} />}
      />
    </Routes>
  )
}
