import { useEffect, useState } from 'react'
import { useMapToolsDispatch } from 'components/context/MapToolsContext'
import { RawSheetsResponse } from 'components/config/types'
import { sheetsToJSON } from 'utils'

import * as config from './config'
import * as Types from './types'
import * as utils from './utils'

type UseCensusData = { error?: string; data: Types.PreppedCensusLUTrow[] }

export type LUTschema = {
  original: string
  pretty: string
  complicated: string
  sort_order: string
}

// Not really a hook, more of a setter
export const useCensusData = (
  type: Types.CensusQueryID,
  existing: Types.PreppedCensusLUTrow[]
): UseCensusData => {
  const mapToolsDispatch = useMapToolsDispatch()
  const [error, setError] = useState<string>()
  const [data, setData] = useState<Types.PreppedCensusLUTrow[]>([])

  useEffect(() => {
    if (existing.length) return

    const fetchCensusLUTData = async () => {
      try {
        const response = await fetch(config.configEndpoints[type])
        const { values } = (await response.json()) as RawSheetsResponse
        const tableRowsPrepped = sheetsToJSON<LUTschema>(values)
        const fields = utils
          .prepCensusFields(tableRowsPrepped, config.censusGroupHeadings[type])
          .sort(utils.sortBySort)

        setData(fields)

        mapToolsDispatch({
          censusType: type,
          type: 'SET_CENSUS_FIELDS',
          payload: fields,
        })
      } catch (err) {
        setError(err.message)
      }
    }

    fetchCensusLUTData()
  }, [existing])

  return { error, data }
}
