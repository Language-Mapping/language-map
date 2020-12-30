import React from 'react'
import { IconButton } from '@material-ui/core'
import { GoFile } from 'react-icons/go'
import { FaMapMarkedAlt } from 'react-icons/fa'

import { DetailsSchema } from 'components/context/types'
import { CountryListItemWithFlag } from './CountryListItemWithFlag'
import { EndoImageModal } from './EndoImageModal'

const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhood and Country

export function renderCountryColumn(
  data: DetailsSchema
): string | React.ReactNode {
  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {data.Country.map((countryWithFlag, i) => (
        <CountryListItemWithFlag
          key={data.Country[i]}
          name={data.Country[i]}
          url={data.countryImg[i].url}
        />
      ))}
    </ul>
  )
}

export function renderEndoColumn(
  data: DetailsSchema
): string | React.ReactNode {
  if (!data['Font Image Alt']) {
    return data.Endonym
  }

  return (
    <EndoImageModal
      url={data['Font Image Alt'][0].url}
      language={data.Language}
    />
  )
}

export function renderDescripCol(): string | React.ReactNode {
  return (
    <IconButton title="View description" size="small" color="secondary">
      <GoFile />
    </IconButton>
  )
}

export function renderIDcolumn(): string | React.ReactNode {
  return (
    <IconButton title="Show in map" size="small" color="secondary">
      <FaMapMarkedAlt />
    </IconButton>
  )
}

export function renderNeighbColumn(
  data: DetailsSchema
): string | React.ReactNode {
  if (!data.Neighborhood || !data.Neighborhood.includes(DEFAULT_DELIM)) {
    // Only NYC hoods will be populated, and not all have more than one value
    return data.Neighborhood
  }

  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {data.Neighborhood.split(DEFAULT_DELIM)
        // .sort() // no! order is intentional ("primary" is first)
        .map((neighborhood) => (
          <li key={neighborhood}>
            <span style={{ marginRight: 4 }}>•</span>
            {neighborhood}
          </li>
        ))}
    </ul>
  )
}

// TODO: some kind of `useState` to set asc/desc and sort Neighborhood
// properly (blanks last, regardless of direction)
// CRED: https://stackoverflow.com/a/29829361/1048518
export function sortNeighbs(a: DetailsSchema, b: DetailsSchema): 0 | 1 | -1 {
  if (a.Neighborhood === b.Neighborhood) return 0
  if (!b.Neighborhood) return -1
  if (!a.Neighborhood) return 1 // nulls sort after anything else

  return a.Neighborhood < b.Neighborhood ? -1 : 1

  // If descending, highest sorts first
  // return a.Neighborhood < b.Neighborhood ? 1 : -1
}
