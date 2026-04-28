import { QueryClient } from '@tanstack/react-query'
import { WP_API_PAGES_ENDPOINT } from './config'

// `password` is part of a hack to attempt to exclude/filter NYC Map pages
// from the ELA website's NextJS builds. It is not intended for security, so
// it's safe to commit.
export const defaultQueryFn = async <T extends unknown>(
  key: number
): Promise<T> =>
  (await fetch(`${WP_API_PAGES_ENDPOINT}/${key}?password=1234`)).json()

// Isolated QueryClient for the WordPress info panel queries (separate cache
// lifecycle from the rest of the app, used via QueryClientProvider).
export const wpQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      gcTime: 600000, // 10 minutes (renamed from cacheTime in v5)
    },
  },
})
