import { useAirtable } from 'components/explore/hooks'
import { UItextTableID, UseUItext } from './types'

export const useUItext = (id: UItextTableID): UseUItext => {
  const { data, isLoading, error } = useAirtable<{ text?: string }>('UI Text', {
    fields: ['text'],
    filterByFormula: `{id} = "${id}"`,
    maxRecords: 1,
  })

  return {
    error,
    isLoading,
    text: data[0]?.text || '',
  }
}
