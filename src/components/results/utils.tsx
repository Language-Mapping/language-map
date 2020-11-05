import React from 'react'
import { IconButton } from '@material-ui/core'
import { GoFile } from 'react-icons/go'
import { FaMapMarkedAlt } from 'react-icons/fa'

import { LangRecordSchema } from '../../context/types'
import countryCodes from './config.emojis.json'
import * as Types from './types'
import { CountryListItemWithFlag } from './CountryListItemWithFlag'
import { EndoImageModal } from './EndoImageModal'

const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhood and Country

export const getCodeByCountry = (countryName: string): string => {
  // TODO: defeat this:
  const countryCodesTyped = countryCodes as Types.CountryCodes

  return countryCodesTyped[countryName] || ''
}

export function renderCountryColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  // TODO: defeat this:
  const countryCodesTyped = countryCodes as Types.CountryCodes
  const countries = data.Country.split(DEFAULT_DELIM)

  const countriesWithFlags = countries.map((country) => {
    if (countryCodesTyped[country]) {
      return countryCodesTyped[country]
    }

    return '' // there SHOULD be a match but if not then just use blank
  })

  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {countriesWithFlags.map((countryWithFlag, i) => (
        <CountryListItemWithFlag
          key={countries[i]}
          countryCode={countryWithFlag}
          name={countries[i]}
        />
      ))}
    </ul>
  )
}

export function renderEndoColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  if (!data['Font Image Alt']) {
    return data.Endonym
  }

  return (
    <EndoImageModal url={data['Font Image Alt']} language={data.Language} />
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
  data: LangRecordSchema
): string | React.ReactNode {
  // Only NYC hoods will be populated, and not all have more than one value
  if (!data.Neighborhood || !data.Neighborhood.includes(DEFAULT_DELIM)) {
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
export function sortNeighbs(
  a: LangRecordSchema,
  b: LangRecordSchema
): 0 | 1 | -1 {
  if (a.Neighborhood === b.Neighborhood) return 0
  if (a.Neighborhood === '') return 1 // nulls sort after anything else
  if (b.Neighborhood === '') return -1

  return a.Neighborhood < b.Neighborhood ? -1 : 1

  // If descending, highest sorts first
  // return a.Neighborhood < b.Neighborhood ? 1 : -1
}
