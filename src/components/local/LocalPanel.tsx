import React, { FC } from 'react'

import {
  GeocoderPopout,
  GeolocToggle,
  LocationSearchContent,
} from 'components/map'
import { PanelContentSimple } from 'components/panels'
import { LocalPanelProps } from 'components/map/types'
import { CensusFieldSelect } from './CensusFieldSelect'

export const LocalPanel: FC<LocalPanelProps> = (props) => {
  return (
    <PanelContentSimple>
      <CensusFieldSelect />
      <LocationSearchContent
        heading="Location tools"
        explanation="Enter an address, municipality, neighborhood, postal code, landmark, or other point of interest within the New York City metro area."
      >
        <GeocoderPopout {...props} />
        <GeolocToggle />
      </LocationSearchContent>
    </PanelContentSimple>
  )
}
