import { useQuery } from 'react-query'
import Airtable from 'airtable'

import { AIRTABLE_BASE } from 'components/config'
import * as utils from './utils'
import * as Types from './types'

export type LegendReturn = {
  data: Types.PreppedLegend[]
  isLoading: boolean
  error?: unknown
  legendHeading?: string
  legendSummary?: string
  routeable?: boolean
}

export const queryDefaults = {
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
}

// TODO: fix TS nightmares
export const useLegend = (tableName: string): LegendReturn => {
  const base = new Airtable().base(AIRTABLE_BASE)
  const {
    data: symbConfig,
    isLoading: isSymbLoading,
    error: symbError,
  } = useQuery<Types.LegendConfigItem[]>(
    ['Schema', tableName],
    (schemaTableName, table) => {
      const sel = base(schemaTableName)
        .select({ filterByFormula: `{name} = '${table}'` })
        .firstPage()

      return sel.then((records) => records)
    },
    queryDefaults
  )

  const firstRecord = symbConfig ? symbConfig[0] : undefined

  const { data, isLoading, error } = useQuery<Types.WorldRegionRecord[]>(
    tableName,
    () => {
      const sel = base(tableName)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .select({ fields: firstRecord.fields.queryFields })
        .firstPage()

      return sel.then((records) => records)
    },
    {
      ...queryDefaults,
      enabled: !!firstRecord,
    }
  )

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let prepped = []

  if (data && symbConfig) {
    prepped = utils.prepAirtableResponse(
      data?.map((record) => record.fields) || [],
      tableName,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      firstRecord.fields
    )
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const legendHeading = firstRecord?.fields?.legendHeading
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const legendSummary = firstRecord?.fields?.legendSummary

  return {
    error: error || symbError,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: prepped,
    isLoading: isLoading || isSymbLoading,
    legendHeading,
    legendSummary,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    routeable: firstRecord?.fields?.routeable,
  }
}
