import { useAirtable } from 'components/explore/hooks'
import * as Types from './types'

export const useCensusFields = (): Types.UseCensusReturn => {
  const { data, isLoading, error } = useAirtable<Types.UseCensusResponse>(
    'Census',
    {
      fields: ['id', 'pretty', 'complicated', 'scope'],
      sort: [{ field: 'sort_order' }],
    }
  )

  return { data, isLoading, error }
}
