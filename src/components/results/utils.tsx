import React from 'react'
import { Link } from '@material-ui/core'
// import { GoFile } from 'react-icons/go'

import { isURL } from '../../utils'
import { LangRecordSchema } from '../../context/types'
import countryCodes from './config.emojis.json'

type CountryCodes = {
  [key: string]: string
}

const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhoods and Countries

// DATA DISCREPANCIES: Democratic Republic of Congo, Ivory Coast
// ABSENT: Congo-Brazzaville and related
// MAYA'S OLD VS. ROSS'S NEW: Micronesia? Korea?
// ISO 3166-1 alpha-2 (⚠️ No support for IE 11)
// CRED:  https://material-ui.com/components/autocomplete/#country-select
export function countryToFlag(isoCode: string): string {
  if (typeof String.fromCodePoint === 'undefined') {
    return isoCode
  }

  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

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
      return countryToFlag(countryCodesTyped[country])
    }

    return country
  })

  return (
    <>
      {countriesWithFlags.map((countryWithFlag, i) => (
        // TODO: into component
        <div
          key={countries[i]}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <div style={{ marginRight: 6 }}>{countryWithFlag}</div>
          <div>{countries[i]}</div>
        </div>
      ))}
    </>
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
  if (!data.Neighborhoods || !data.Neighborhoods.includes(DEFAULT_DELIM)) {
    return data.Neighborhoods
  }

  // TODO: rm if not using
  // const searchRegExp = new RegExp(DEFAULT_DELIM, 'g') // Throws SyntaxError
  // const replaceWith = ',\n\n'
  // const replaceWith = 'OK'
  // return data.Neighborhoods.split(DEFAULT_DELIM).join(',\r')

  return (
    <ul style={{ paddingLeft: 2, margin: 0 }}>
      {data.Neighborhoods.split(DEFAULT_DELIM).map((neighborhood) => (
        <li key={neighborhood}>{neighborhood}</li>
      ))}
    </ul>
  )
}

export function renderDescripColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  return !data.Description || `${data.Description.slice(0, 80).trimEnd()}...`
  // return !data.Description || <GoFile />
}
