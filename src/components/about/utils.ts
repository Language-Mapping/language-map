import { QueryCache } from 'react-query'
import { WP_API_PAGES_ENDPOINT } from './config'

// Define a default query function that will receive the query key
export const defaultQueryFn = async <T extends unknown>(
  key: number
): Promise<T> => (await fetch(`${WP_API_PAGES_ENDPOINT}/${key}`)).json()

// Provide the default query function to your app with defaultConfig
export const wpQueryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnMount: false,
      cacheTime: 1800000, // 1000 * 60 * 30, // ms * sec * min. Default: 5 min.
    },
  },
})
