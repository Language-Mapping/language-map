import { useQuery } from 'react-query'
import Airtable from 'airtable'

import { AIRTABLE_BASE, reactQueryDefaults } from 'components/config'
import { LangRecordSchema } from 'components/context'

export type UseFullData = {
  data: LangRecordSchema[]
  isLoading: boolean
  error: unknown
}

const fields = [
  'Country',
  'Description',
  'Endonym',
  'ID',
  'Global Speaker Total',
  'Addl Neighborhoods',
  'Glottocode',
  'ISO 639-3',
  'Language Family',
  'Language',
  'Primary Location',
  'Size',
  'Status',
  'World Region',
]

// Same as useLayerConfig but takes a table name param for single-table us.
// TODO: consider reusing this whole thing. It could get repetitive.
export const useFullData = (): UseFullData => {
  const base = new Airtable().base(AIRTABLE_BASE)
  const { data, isLoading, error } = useQuery(
    ['Data', 'full'],
    (schemaTableName: string, field) => {
      const allData = base(schemaTableName).select({ fields }).firstPage()

      return allData.then((records) => records)
    },
    { ...reactQueryDefaults, refetchOnMount: true }
  )

  return {
    error,
    data: data?.map((row) => row.fields) || [],
    isLoading,
    ...fields,
  }
}
