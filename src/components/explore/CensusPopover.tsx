import React, { FC } from 'react'
import { FaClipboardList } from 'react-icons/fa'

import { useMapToolsDispatch } from 'components/context'
import { CensusQueryID } from 'components/spatial'
import { ChipWithClick } from 'components/details'

export type CensusPopoverProps = {
  tractField?: string
  pumaField?: string
}

export const CensusPopover: FC<CensusPopoverProps> = (props) => {
  const { pumaField, tractField } = props
  const mapToolsDispatch = useMapToolsDispatch()
  const hasCensus = pumaField || tractField

  if (!hasCensus) return null

  let censusType: CensusQueryID

  if (pumaField) censusType = 'puma'
  else if (tractField) censusType = 'tracts'

  return (
    <div style={{ marginTop: '1em' }}>
      <ChipWithClick
        icon={<FaClipboardList />}
        title="Show census options"
        text="Census"
        handleClick={() => {
          mapToolsDispatch({
            type: 'SET_CENSUS_FIELD',
            censusType,
            payload: pumaField || tractField,
          })
        }}
      />
    </div>
  )
}
