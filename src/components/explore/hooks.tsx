import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import Airtable from 'airtable'

import {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE,
  reactQueryDefaults,
} from 'components/config'
import {
  AirtableOptions,
  TonsOfFields,
  AirtableError,
  ReactQueryOptions,
} from './types'

type AirtableQueryKey = [string, AirtableOptions]

const airtableQuery = async ({
  queryKey,
}: QueryFunctionContext<AirtableQueryKey>) => {
  const [tableName, options] = queryKey
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
    options?.baseID || AIRTABLE_BASE
  )

  // CRED: github.com/Airtable/airtable.js/issues/69#issuecomment-414394657
  return base(tableName).select(options).all()
}

export function useAirtable<TResult = TonsOfFields>(
  tableName: string, // TODO: TS all the tables
  options: AirtableOptions,
  reactQueryOptions?: ReactQueryOptions
): {
  data: TResult[]
  error: AirtableError | null
  isLoading: boolean
} {
  const { data, isLoading, error } = useQuery<
    { fields: TResult }[],
    AirtableError,
    { fields: TResult }[],
    AirtableQueryKey
  >({
    queryKey: [tableName, options],
    queryFn: airtableQuery,
    ...reactQueryDefaults,
    ...reactQueryOptions,
  })

  return {
    error,
    data: data?.map((row) => row.fields) || [],
    isLoading,
  }
}

export const useIcon = (
  value: string,
  tableName = 'Country',
  imgField = 'src_image'
): string => {
  const { data, isLoading, error } = useAirtable<{
    src_image: { url: string }[]
  }>(tableName, {
    fields: [imgField],
    filterByFormula: `{name} = "${value}"`,
  })

  // TODO: deal w/TS
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (isLoading || error || !data || !data[0] || !data[0][imgField]) return ''

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return data[0][imgField][0].url
}
