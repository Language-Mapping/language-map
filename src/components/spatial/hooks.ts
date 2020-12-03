import { useEffect, useState } from 'react'
import { useMapToolsDispatch } from 'components/context/MapToolsContext'

import * as config from './config'
import * as Types from './types'
import * as utils from './utils'

type JustAnError = { error?: string }

export const useCensusData = (
  type: Types.CensusQueryID,
  allSet: number
): JustAnError => {
  const mapToolsDispatch = useMapToolsDispatch()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (allSet) return

    const fetchCensusLUTData = async () => {
      try {
        const response = await fetch(config.configEndpoints[type])
        const data: Types.SheetsLUTresponse = await response.json()

        const fields = utils
          .prepCensusFields(data, config.censusGroupHeadings[type])
          .sort(utils.sortBySort)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSet])

  return { error }
}
