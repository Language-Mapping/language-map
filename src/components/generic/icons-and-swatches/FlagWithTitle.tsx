import React, { FC } from 'react'

import { useIcon } from 'components/explore/hooks'

type FlagWithTitle = {
  countryName: string
  omitText?: boolean
}

export const FlagWithTitle: FC<{
  altText?: string
  omitText?: boolean
  src: string
}> = (props) => {
  const { altText, omitText, src } = props

  return (
    <>
      <img
        style={{ height: '0.8em', marginRight: '0.25rem' }}
        className="country-flag"
        alt={`${altText} flag`}
        src={src}
      />{' '}
      {!omitText && altText}
    </>
  )
}

export const FlagFromHook: FC<{ value: string }> = (props) => {
  const { value } = props
  const iconUrl = useIcon(value)
  if (!iconUrl) return null

  return <FlagWithTitle altText={value} src={iconUrl} omitText />
}
