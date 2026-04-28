import React, { FC } from 'react'
import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Airtable from 'airtable'

import { AIRTABLE_API_KEY, reactQueryDefaults } from 'components/config'
import { PanelContextProvider } from 'components/panels'
import { ResultsModal } from 'components/results'
import { AppWrap } from './AppWrap'
import { MapToolsProvider } from './context/MapToolsContext'

const queryClient = new QueryClient({
  defaultOptions: { queries: reactQueryDefaults },
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore // great start 🙄
Airtable.configure({ apiKey: AIRTABLE_API_KEY })

export const App: FC = () => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <>
          <div>You have encountered an error</div>
          <div>{(error as Error).toString()}</div>
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
      <QueryClientProvider client={queryClient}>
        <MapToolsProvider>
          <PanelContextProvider>
            <AppWrap />
          </PanelContextProvider>
          {/* TODO: make Suspense/Lazy work on poor connections */}
          <ResultsModal />
        </MapToolsProvider>
        {import.meta.env.DEV && (
          <ReactQueryDevtools buttonPosition="bottom-right" />
        )}
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  )
}
