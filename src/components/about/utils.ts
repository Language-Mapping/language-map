import { QueryCache } from 'react-query'
import { WP_API_PAGES_ENDPOINT } from './config'

// Define a default query function that will receive the query key
export const defaultQueryFn = async (key: number): Promise<void> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${key}`)).json()

// Provide the default query function to your app with defaultConfig
export const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQueryFn,
      cacheTime: 1000 * 60 * 30, // ms * sec * min. Default is 5 min.
    },
  },
})
