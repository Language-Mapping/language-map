import { useQuery } from 'react-query'
import Airtable from 'airtable'

import { AIRTABLE_BASE, reactQueryDefaults } from 'components/config'
import * as utils from './utils'
import * as Types from './types'

const defaultSymbQueryFields: (keyof Types.AtSymbFields)[] = [
  'icon-color',
  'icon-image',
  'icon-size',
  'text-color',
  'text-halo-color',
  'name',
]

// Same as useLayerConfig but takes a table name param for single-table us.
// TODO: consider reusing this whole thing. It could get repetitive.
export const useLegendConfig: Types.UseLegendConfig = (tableName) => {
  const base = new Airtable().base(AIRTABLE_BASE)
  const {
    data: symbConfig,
    isLoading: isSymbLoading,
    error: symbError,
  } = useQuery<Types.AtSchemaRecord[]>(
    ['Schema', 'symbolizeable'],
    (schemaTableName, field) => {
      const symbolizeables = base(schemaTableName)
        .select({ filterByFormula: `{${field}} != ''` })
        .firstPage()

      return symbolizeables.then((records) => records)
    },
    { ...reactQueryDefaults, refetchOnMount: true }
  )

  let firstRecord

  if (symbConfig) {
    firstRecord = symbConfig.find((row) => row.fields.name === tableName)
  }

  const { fields } = firstRecord || {}
  const queryFields = fields?.queryFields || []

  const { data, isLoading, error } = useQuery<Types.AtSymbRecord[]>(
    [tableName, 'legend'],
    () => {
      const sel = base(tableName)
        .select({
          fields: [...defaultSymbQueryFields, ...queryFields] || [],
        })
        .firstPage()

      return sel.then((records) => records)
    },
    { ...reactQueryDefaults, refetchOnMount: true, enabled: !!firstRecord }
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
