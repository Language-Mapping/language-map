import React, { FC } from 'react'
import { Link } from '@material-ui/core'
// import { GoFile } from 'react-icons/go'

import { isURL } from '../../utils'
import { LangRecordSchema } from '../../context/types'
import countryCodes from './config.emojis.json'

type CountryCodes = {
  [key: string]: string
}

type CountryWithEmojiComponent = {
  flag: string
  name: keyof CountryCodes
}

const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhoods and Countries

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

const CountryWithEmojiFlag: FC<CountryWithEmojiComponent> = (props) => {
  const { name, flag } = props

  return (
    <li style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 6 }}>{flag}</div>
      <div>{name}</div>
    </li>
  )
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

    return '' // there SHOULD be a match but if not then just use blank
  })

  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {countriesWithFlags.map((countryWithFlag, i) => (
        <CountryWithEmojiFlag
          key={countries[i]}
          flag={countryWithFlag}
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
      {data.Neighborhoods.split(DEFAULT_DELIM).map((neighborhood) => (
        <li key={neighborhood}>
          <span style={{ marginRight: 4 }}>•</span>
          {neighborhood}
        </li>
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