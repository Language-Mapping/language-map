import React, { FC, useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { Route } from 'react-router-dom'
import { queryCache } from 'react-query'
import { GoInfo } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { AboutPageView, WelcomeDialog } from 'components/about'
import { ResultsModal } from 'components/results'
import { fetchAbout, fetchHelp, fetchWelcome } from 'components/about/utils'
import { paths as routes } from 'components/config/routes'
import { ABOUT_QUERY, HELP_QUERY, WELCOME_QUERY } from 'components/about/config'
import { AppWrap } from './AppWrap'

export const App: FC = () => {
  useEffect(() => {
    queryCache.prefetchQuery(WELCOME_QUERY, fetchWelcome)
    queryCache.prefetchQuery(ABOUT_QUERY, fetchAbout)
    queryCache.prefetchQuery(HELP_QUERY, fetchHelp)
  }, [])

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
      <AppWrap />
      {/* ERROR: null is not an object (evaluating 'window.localStorage.hideWelcome') */}
      {/* FIXME: https://sentry.io/organizations/endangered-language-alliance/issues/1953110114/?project=5313356 */}
      {!window.localStorage.hideWelcome && (
        <WelcomeDialog queryName={WELCOME_QUERY} />
      )}
      <Route path={routes.about}>
        <AboutPageView
          title="About"
          icon={<GoInfo />}
          queryName={ABOUT_QUERY}
        />
      </Route>
      <Route path={routes.help}>
        <AboutPageView
          title="Help"
          icon={<AiOutlineQuestionCircle />}
          queryName={HELP_QUERY}
        />
      </Route>
      <ResultsModal />
    </Sentry.ErrorBoundary>
  )
}
