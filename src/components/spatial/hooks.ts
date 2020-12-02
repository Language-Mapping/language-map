import { useEffect, useState } from 'react'
import { useMapToolsDispatch } from 'components/context/MapToolsContext'

import * as config from './config'
import * as Types from './types'
import * as utils from './utils'

export const useCensusData = (
  type: Types.CensusQueryID,
  allSet: number
): { error?: string } => {
  const mapToolsDispatch = useMapToolsDispatch()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (allSet) return

    const fetchCensusLUTData = async (action: string) => {
      try {
        const response = await fetch(config.configEndpoints[type])
        const data: Types.SheetsLUTresponse = await response.json()

        const fields = utils
          .prepCensusFields(data, config.censusGroupHeadings[type])
          .sort(utils.sortBySort)

        mapToolsDispatch({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: action,
          payload: fields,
        })
      } catch (err) {
        setError(err.message)
      }
    }

    // TODO: in context, use object w/same keys instead of multiple actions
    if (type === 'tracts') fetchCensusLUTData('SET_TRACTS_FIELDS')
    else if (type === 'puma') fetchCensusLUTData('SET_PUMA_FIELDS')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSet])

  return { error }
}
