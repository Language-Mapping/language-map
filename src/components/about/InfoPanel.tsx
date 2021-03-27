import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { ReactQueryCacheProvider } from 'react-query'

import { AboutPageView, WelcomeDialog, FeedbackForm } from 'components/about'
import { wpQueryCache } from 'components/about/utils'
import { routes } from 'components/config/api'
import { Nav } from 'components/nav'
import { wpQueryIDs } from './config'

export const InfoPanel: FC = () => {
  return (
    <>
      <ReactQueryCacheProvider queryCache={wpQueryCache}>
        {/* ERROR: null is not an object (evaluating 'window.localStorage.hideWelcome') */}
        {/* FIXME: https://sentry.io/organizations/endangered-language-alliance/issues/1953110114/?project=5313356 */}
        {!window.localStorage.hideWelcome && (
          <WelcomeDialog queryKey={wpQueryIDs.welcome} />
        )}
        <Route path={routes.about}>
          <AboutPageView title="About" queryKey={wpQueryIDs.about} />
        </Route>
        <Route path={routes.help}>
          <AboutPageView title="Help" queryKey={wpQueryIDs.help} />
        </Route>
        <Route path={routes.feedback}>
          <FeedbackForm />
        </Route>
      </ReactQueryCacheProvider>
      <Route path={routes.info} exact>
        <Nav />
      </Route>
    </>
  )
}
