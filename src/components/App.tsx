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
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore — Sentry 5.x's ErrorBoundary props don't include children;
    // fixed in @sentry/react v6+ which is a future phase.
    <Sentry.ErrorBoundary
      fallback={(props) => (
        <>
          <div>You have encountered an error</div>
          <div>{(props as { error: Error }).error.toString()}</div>
          <div>{(props as { componentStack: string }).componentStack}</div>
          <button
            type="button"
            onClick={() => {
              ;(props as { resetError: () => void }).resetError()
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
        {import.meta.env.DEV && <ReactQueryDevtools position="bottom-right" />}
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  )
}
