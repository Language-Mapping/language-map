import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { AboutPageView, FeedbackForm } from 'components/about'
import { wpQueryClient } from 'components/about/utils'
import { Nav } from 'components/nav'
import { wpQueryIDs } from './config'
import { WaysToHelp } from './WaysToHelp'

export const InfoPanel: FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<WaysToHelp />} />
      </Routes>
      <QueryClientProvider client={wpQueryClient}>
        <Routes>
          <Route
            path="About"
            element={<AboutPageView noImgShadow queryKey={wpQueryIDs.about} />}
          />
          <Route
            path="Help"
            element={<AboutPageView queryKey={wpQueryIDs.help} />}
          />
          <Route path="Feedback" element={<FeedbackForm />} />
        </Routes>
      </QueryClientProvider>
      <Routes>
        <Route index element={<Nav />} />
      </Routes>
    </>
  )
}
