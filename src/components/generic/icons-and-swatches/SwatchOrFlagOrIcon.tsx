import React, { FC } from 'react'

import { SwatchOnly } from 'components/legend'
import * as Types from 'components/explore/types'
import { exploreIcons } from 'components/explore/config'

import { FlagWithTitle } from './FlagWithTitle'

// TODO: forgot about `Status`. Include it?
// TODO: restore
export const SwatchOrFlagOrIconNew: FC<
  Types.SwatchOrFlagOrIcon & { color?: string; src?: string }
> = (props) => {
  const { field, value, color, src } = props

  if (field === 'World Region' && color)
    return <SwatchOnly backgroundColor={color} />

  if (field === 'Country' && src)
    return <FlagWithTitle omitText altText={value} src={src} />

  return <>{exploreIcons[field]}</>
}
