import { useAirtable } from 'components/explore/hooks'
import * as utils from './utils'
import * as Types from './types'
import { layerSymbFields } from './config'

// Same as useLayerConfig but takes a table name param for single-table us.
// TODO: consider reusing this whole thing. It could get repetitive.
export const useLegendConfig: Types.UseLegendConfig = (tableName) => {
  const {
    data: symbConfig,
    isLoading: isSymbLoading,
    error: symbError,
  } = useAirtable<Types.AtSchemaFields>('Schema', {
    filterByFormula: `{name} = '${tableName}'`,
    maxRecords: 1,
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const moreFields = layerSymbFields[tableName] || []
  const firstRecord = symbConfig[0]

  const { data, isLoading, error } = useAirtable(tableName, {
    // WOW: field order really matters in regards to react-query (serialized)
    fields: [...moreFields, 'name'],
  })

  let prepped: Types.LegendProps[] = []

  if (firstRecord && Object.keys(firstRecord).length)
    prepped = utils.prepAirtableResponse(data, tableName, firstRecord)

  return {
    error: error || symbError,
    data: prepped,
    isLoading: isLoading || isSymbLoading,
    ...firstRecord,
  }
}
