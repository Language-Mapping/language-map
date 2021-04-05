import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { ReactQueryCacheProvider } from 'react-query'

import { AboutPageView, FeedbackForm } from 'components/about'
import { wpQueryCache } from 'components/about/utils'
import { routes } from 'components/config/api'
import { Nav } from 'components/nav'
import { wpQueryIDs } from './config'

export const InfoPanel: FC = () => {
  return (
    <>
      <ReactQueryCacheProvider queryCache={wpQueryCache}>
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
