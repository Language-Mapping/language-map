import React, { FC } from 'react'
import * as Sentry from '@sentry/react'
// import { ReactQueryDevtools } from 'react-query-devtools'
import Airtable from 'airtable'

import { AIRTABLE_API_KEY } from 'components/config'
import { PanelContextProvider } from 'components/panels'
import { ResultsModal } from 'components/results'
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
        {/* TODO: make Suspense/Lazy work on poor connections */}
        <ResultsModal />
      </MapToolsProvider>
      {/* <ReactQueryDevtools /> */}
    </Sentry.ErrorBoundary>
  )
}
