import React from 'react'
import { IconButton } from '@mui/material'
import { GoFile } from 'react-icons/go'
import { FaMapMarkedAlt } from 'react-icons/fa'

import { InstanceLevelSchema, InternalWithLang } from 'components/context/types'
import { CountryListItemWithFlag } from './CountryListItemWithFlag'
import { EndoImageModal } from './EndoImageModal'
import { LangCellParams } from './types'

export const FILTER_CLASS = 'for-filter'

export function renderCountryColumn(
  params: LangCellParams
): string | React.ReactNode {
  const data = params.row

  return (
    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {data.Country.map((countryWithFlag, i) => (
        <CountryListItemWithFlag
          key={data.Country[i]}
          name={data.Country[i]}
          url={data.countryImg[i].url}
          filterClassName={FILTER_CLASS}
        />
      ))}
    </ul>
  )
}

export function renderEndoColumn(
  params: LangCellParams
): string | React.ReactNode {
  const data = params.row

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
    <IconButton title="View full-screen details" size="small" color="secondary">
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

export const whittleLangFeats = (
  data: InstanceLevelSchema[]
): InternalWithLang[] =>
  data.map((row) => {
    const { id, Latitude, Longitude, Language } = row

    return { id, Latitude, Longitude, Language }
  })
