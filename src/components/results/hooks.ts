import { useAirtable } from 'components/explore/hooks'
import { DescripResponse, DescripsTableName, UseDescription } from './types'

export const useDescription = (
  descripTable: DescripsTableName,
  descriptionID: string
): UseDescription =>
  useAirtable<DescripResponse>(descripTable, {
    fields: ['Description'],
    filterByFormula: `{id} = '${descriptionID}'`,
    maxRecords: 1,
  })
