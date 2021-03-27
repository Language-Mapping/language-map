import React, { FC, Suspense } from 'react'
import * as Sentry from '@sentry/react'
// import { ReactQueryDevtools } from 'react-query-devtools'
import Airtable from 'airtable'

import { AIRTABLE_API_KEY } from 'components/config'
import { PanelContextProvider } from 'components/panels'
import { AppWrap } from './AppWrap'
import { MapToolsProvider } from './context/MapToolsContext'

// // Provide the default query function to your app with defaultConfig
// const mainQueryCache = new QueryCache({
//   defaultConfig: {
//     queries: {
//       queryFn: asyncAwaitFetch,
//       refetchOnMount: false,
//       cacheTime: 1800000, // 1000 * 60 * 30, // ms * sec * min. Default: 5 min.
//     },
//   },
// })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore // great start 🙄
Airtable.configure({ apiKey: AIRTABLE_API_KEY })

// Good tut on this: https://ui.dev/react-router-v4-code-splitting/
const LazyTable = React.lazy(
  () =>
    // webpackChunkName does not seem to work here. Maybe because there is
    // another webpackChunkName nested inside the imported components?
    import(/* webpackChunkName: "table" */ 'components/results/ResultsModal')
)

export const App: FC = () => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <>
          <div>You have encountered an error</div>
          <div>{error.toString()}</div>
          <div>{componentStack}</div>
          <button
            type="button"
            onClick={() => {
              resetError()
            }}
          >
            Click here to reset
          </button>
        </>
      )}
    >
      <MapToolsProvider>
        <PanelContextProvider>
          <AppWrap />
        </PanelContextProvider>
        {/* TODO: understand this and create legit fallback element */}
        <Suspense fallback={<div />}>
          <LazyTable />
        </Suspense>
      </MapToolsProvider>
      {/* <ReactQueryDevtools /> */}
    </Sentry.ErrorBoundary>
  )
}
