import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { ReactQueryCacheProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query-devtools'
import { GoInfo } from 'react-icons/go'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { AboutPageView, WelcomeDialog } from 'components/about'
import { wpQueryCache } from 'components/about/utils'
import { routes } from 'components/config/api'
import { Nav } from 'components/nav'
import { wpQueryIDs } from './config'

export const InfoPanel: FC = () => {
  const iframeSrc =
    'https://docs.google.com/forms/d/e/1FAIpQLSe5VQ3rLOXett6xN_lUUqm5X88rb5NgWeF6bbObRX9Sconc2w/viewform?embedded=true'

  return (
    <>
      <ReactQueryCacheProvider queryCache={wpQueryCache}>
        {/* ERROR: null is not an object (evaluating 'window.localStorage.hideWelcome') */}
        {/* FIXME: https://sentry.io/organizations/endangered-language-alliance/issues/1953110114/?project=5313356 */}
        {!window.localStorage.hideWelcome && (
          <WelcomeDialog queryKey={wpQueryIDs.welcome} />
        )}
        <Route path={routes.about}>
          <AboutPageView
            title="About"
            icon={<GoInfo />}
            queryKey={wpQueryIDs.about}
          />
        </Route>
        <Route path={routes.help}>
          <AboutPageView
            title="Help"
            icon={<AiOutlineQuestionCircle />}
            queryKey={wpQueryIDs.help}
          />
        </Route>
        <Route path={routes.feedback}>
          <div style={{ height: '70vh' }}>
            <iframe
              src={iframeSrc}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Feedback and questions"
            >
              Loading…
            </iframe>
          </div>
        </Route>
      </ReactQueryCacheProvider>

      <Route path={routes.info} exact>
        <Nav />
      </Route>
    </>
  )
}
