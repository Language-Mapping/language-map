import { useQuery } from 'react-query'
import Airtable from 'airtable'

import { AIRTABLE_BASE, reactQueryDefaults } from 'components/config'
import * as utils from './utils'
import * as Types from './types'

export type LegendReturn = {
  data: Types.LegendProps[]
  isLoading: boolean
  error?: unknown
} & Types.AtSchemaFields

export const useLegend = (tableName: string): LegendReturn => {
  const base = new Airtable().base(AIRTABLE_BASE)
  const {
    data: symbConfig,
    isLoading: isSymbLoading,
    error: symbError,
  } = useQuery<Types.AtSchemaRecord[]>(
    ['Schema', tableName],
    (schemaTableName, table) => {
      const sel = base(schemaTableName)
        .select({ filterByFormula: `{name} = '${table}'` })
        .firstPage()

      return sel.then((records) => records)
    },
    reactQueryDefaults
  )

  const firstRecord = symbConfig ? symbConfig[0] : undefined
  const { fields } = firstRecord || {}

  const { data, isLoading, error } = useQuery<Types.AtSymbRecord[]>(
    tableName,
    () => {
      const sel = base(tableName)
        .select({ fields: fields?.queryFields || [] })
        .firstPage()

      return sel.then((records) => records)
    },
    {
      ...reactQueryDefaults,
      enabled: !!firstRecord,
    }
  )

  let prepped: Types.LegendProps[] = []

  if (data && symbConfig) {
    prepped = utils.prepAirtableResponse(
      data?.map((record) => record.fields) || [],
      tableName,
      fields
    )
  }

  return {
    error: error || symbError,
    data: prepped,
    isLoading: isLoading || isSymbLoading,
    ...fields,
  }
}
