import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { AboutPageView, FeedbackForm } from 'components/about'
import { wpQueryClient } from 'components/about/utils'
import { routes } from 'components/config/api'
import { Nav } from 'components/nav'
import { wpQueryIDs } from './config'
import { WaysToHelp } from './WaysToHelp'

export const InfoPanel: FC = () => {
  return (
    <>
      <Route path={routes.info} exact>
        <WaysToHelp />
      </Route>
      <QueryClientProvider client={wpQueryClient}>
        <Route path={routes.about}>
          <AboutPageView noImgShadow queryKey={wpQueryIDs.about} />
        </Route>
        <Route path={routes.help}>
          <AboutPageView queryKey={wpQueryIDs.help} />
        </Route>
        <Route path={routes.feedback}>
          <FeedbackForm />
        </Route>
      </QueryClientProvider>
      <Route path={routes.info} exact>
        <Nav />
      </Route>
    </>
  )
}
