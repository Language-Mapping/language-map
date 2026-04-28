import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
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
      <Routes>
        <Route path={routes.info} element={<WaysToHelp />} />
      </Routes>
      <QueryClientProvider client={wpQueryClient}>
        <Routes>
          <Route
            path={routes.about}
            element={<AboutPageView noImgShadow queryKey={wpQueryIDs.about} />}
          />
          <Route
            path={routes.help}
            element={<AboutPageView queryKey={wpQueryIDs.help} />}
          />
          <Route path={routes.feedback} element={<FeedbackForm />} />
        </Routes>
      </QueryClientProvider>
      <Routes>
        <Route path={routes.info} element={<Nav />} />
      </Routes>
    </>
  )
}
