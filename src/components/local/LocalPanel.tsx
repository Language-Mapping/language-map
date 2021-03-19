import React, { FC } from 'react'

import {
  GeocoderPopout,
  GeolocToggle,
  LocationSearchContent,
} from 'components/map'
import { PanelContentSimple } from 'components/panels'
import { LocalPanelProps } from 'components/map/types'
import { AllLangDataToggle } from 'components/legend'
import { CensusFieldSelect } from './CensusFieldSelect'
import { CensusIntro } from './CensusIntro'

export const LocalPanel: FC<LocalPanelProps> = (props) => {
  return (
    <PanelContentSimple>
      <LocationSearchContent
        heading="Census Language Data (NYC only)"
        explanation={<CensusIntro />}
      >
        <CensusFieldSelect />
        <AllLangDataToggle />
      </LocationSearchContent>
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
