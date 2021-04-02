import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { useAirtable } from 'components/explore/hooks'
import { AIRTABLE_CENSUS_BASE } from 'components/config'
import { useMapToolsState } from 'components/context'

export const CensusRecordDetail: FC = (props) => {
  const { censusActiveField } = useMapToolsState()
  const params = useParams<{ table: string; field: string; id: string }>()
  const { table, field, id } = params

  const { data, isLoading, error } = useAirtable<{ [key: string]: number }>(
    table,
    {
      fields: [field],
      filterByFormula: `{GEOID} = "${id}"`,
      maxRecords: 1,
      baseID: AIRTABLE_CENSUS_BASE,
    }
  )

  if (isLoading || error) return null

  return (
    <div>
      <h1>{censusActiveField?.pretty}</h1>
      <h2>
        {data[0] ? `Speakers: ${data[0][field]}` : null}
        {!data[0] ? `Not found: ${field} with id of ${id} (${table})` : null}
      </h2>
    </div>
  )
}
