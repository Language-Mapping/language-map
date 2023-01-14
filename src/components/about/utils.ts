import { QueryCache } from 'react-query'
import { WP_API_PAGES_ENDPOINT } from './config'

// Define a default query function that will receive the query key
export const defaultQueryFn = async <T extends unknown>(
  key: number
): Promise<T> =>
  // `password` is part of a hack to attempt to exclude/filter NYC Map pages
  // from the ELA website's NextJS builds. It is not intended for security, so
  // it's safe to commit.
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${key}?password=1234`)).json()

// Provide the default query function to your app with defaultConfig
export const wpQueryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // 1000 * 60 * 30, // ms * sec * min. Default: 5 min.
      cacheTime: 600000, // 600000 = 10 minutes
    },
  },
})
