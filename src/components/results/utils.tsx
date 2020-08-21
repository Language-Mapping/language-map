import React from 'react'
import { Link } from '@material-ui/core'

import { isURL } from '../../utils'
import { LangRecordSchema } from '../../context/types'
import countryCodes from './config.emojis.json'

import { CountryCodes } from './types'
import { CountryListItemWithFlag } from './CountryListItemWithFlag'

const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhoods and Countries

export function renderCountriesColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  if (!data.Countries) {
    return ''
  }

  const countryCodesTyped = countryCodes as CountryCodes // TODO: defeat this
  const countries = data.Countries.split(DEFAULT_DELIM)

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

// TODO: instead of downloading, open image in modal or a Popover
// Show a link to the download file if endo starts with `http`
export function renderEndoColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  if (!isURL(data.Endonym)) {
    return data.Endonym
  }

  return (
    <Link href={data.Endonym} target="_blank" rel="noreferrer">
      Download image
    </Link>
  )
}

export function renderNeighbColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  // Only NYC hoods will be populated, and not all have more than one value
  if (!data.Neighborhoods || !data.Neighborhoods.includes(DEFAULT_DELIM)) {
    return data.Neighborhoods
  }

  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {data.Neighborhoods.split(DEFAULT_DELIM)
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

// TODO: restore when ready for swatch, otherwise remove
// export function renderCommSizeColumn(
//   data: LangRecordSchema
// ): string | React.ReactNode {
//   // TODO: icon swatch
//   return COMM_SIZE_COL_MAP[data['Size']]
// }

export function renderWorldRegionColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  return data['World Region'] // TODO: icon swatch
}
