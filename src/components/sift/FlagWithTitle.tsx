import React, { FC } from 'react'
import { getCodeByCountry } from 'components/results'

type FlagWithTitle = {
  countryName: string
  omitText?: boolean
}

export const FlagWithTitle: FC<FlagWithTitle> = (props) => {
  const { countryName, omitText } = props

  return (
    <>
      <img
        style={{
          height: '0.8em',
          marginRight: '0.25em',
        }}
        className="country-flag"
        alt={`${countryName} flag`}
        src={`/img/country-flags/${getCodeByCountry(
          countryName
        ).toLowerCase()}.svg`}
      />{' '}
      {!omitText && countryName}
    </>
  )
}
