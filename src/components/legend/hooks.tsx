import { useQuery } from 'react-query'
import Airtable from 'airtable'

import { AIRTABLE_BASE } from 'components/config'
import * as utils from './utils'
import * as Types from './types'

export type LegendReturn = {
  data: Types.PreppedLegend[]
  isLoading: boolean
  error?: unknown
}

export const useLegend = (
  config: Types.LegendConfigItem,
  tableName: string
): LegendReturn => {
  const { fields } = config
  const base = new Airtable().base(AIRTABLE_BASE)

  const { data, isLoading, error } = useQuery<Types.WorldRegionRecord[]>(
    tableName,
    () => {
      // .all() // implement for larger queries over 100+
      const sel = base(tableName).select({ fields }).firstPage()

      return sel.then((records) => records)
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const prepped = utils.prepAirtableResponse(
    data?.map((record) => record.fields) || [],
    tableName,
    config
  )

  return { error, data: prepped, isLoading }
}
