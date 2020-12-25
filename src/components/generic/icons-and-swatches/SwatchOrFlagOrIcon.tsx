import React, { FC } from 'react'

import { SwatchOnly } from 'components/legend'
import * as Types from 'components/explore/types'
import { exploreIcons } from 'components/explore/config'

import { getSwatchColorByConfig } from '../../legend/utils'
import { FlagWithTitle } from './FlagWithTitle'

// TODO: forgot about `Status`. Include it.
// TODO: rename components and this file. Mv components into new files..
export const SwatchOrFlagOrIcon: FC<Types.SwatchOrFlagOrIcon> = (props) => {
  const { field, value } = props

  if (field === 'World Region' && value) {
    return <SwatchOnly backgroundColor={getSwatchColorByConfig(value)} />
  }

  if (field === 'Country' && value) {
    return <FlagWithTitle omitText countryName={value as string} />
  }

  return <>{exploreIcons[field]}</>
}
