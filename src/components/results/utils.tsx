import React, { useContext, FC } from 'react'

import { LegendSwatch } from 'components/legend'
import { GlobalContext } from 'components'
import { LangRecordSchema } from '../../context/types'
import countryCodes from './config.emojis.json'
import * as Types from './types'
import { CountryListItemWithFlag } from './CountryListItemWithFlag'
import { EndoImageModal } from './EndoImageModal'

const DEFAULT_DELIM = ', ' // e.g. for multi-value Neighborhoods and Countries

export function renderCountriesColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  // TODO: defeat this:
  const countryCodesTyped = countryCodes as Types.CountryCodes
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
  if (!data['Font Image Alt']) {
    return data.Endonym
  }

  return (
    <EndoImageModal url={data['Font Image Alt']} language={data.Language} />
  )
}

export function renderGlobalSpeakColumn(
  data: LangRecordSchema
): string | React.ReactNode {
  return (
    !data['Global Speaker Total'] || (
      // Right-aligned number w/left-aligned column heading was requested
      <div style={{ paddingRight: 16 }}>
        {data['Global Speaker Total'].toLocaleString()}
      </div>
    )
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

type Gah = { data: LangRecordSchema }

export const RenderWorldRegionColumn: FC<Gah> = (props) => {
  // TODO: if there's a way to pass down legend symbols without going allll the
  // way to global state, hook it up.
  const { state } = useContext(GlobalContext)
  const { data } = props
  const { 'World Region': WorldRegion } = data

  const regionSwatchColor =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.legendSymbols[WorldRegion].paint['icon-color'] as string

  return (
    <LegendSwatch
      legendLabel={data['World Region']}
      component="div"
      iconID="_circle"
      backgroundColor={regionSwatchColor || 'transparent'}
      labelStyleOverride={{ lineHeight: 'inherit', marginLeft: 2 }}
    />
  )
}

// TODO: some kind of `useState` to set asc/desc and sort Neighborhoods
// properly (blanks last, regardless of direction)
// CRED: https://stackoverflow.com/a/29829361/1048518
export function sortNeighbs(
  a: LangRecordSchema,
  b: LangRecordSchema
): 0 | 1 | -1 {
  if (a.Neighborhoods === b.Neighborhoods) {
    return 0
  }

  // nulls sort after anything else
  if (a.Neighborhoods === '') {
    return 1
  }

  if (b.Neighborhoods === '') {
    return -1
  }

  return a.Neighborhoods < b.Neighborhoods ? -1 : 1

  // If descending, highest sorts first
  // return a.Neighborhoods < b.Neighborhoods ? 1 : -1
}
