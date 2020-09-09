import React, { FC, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { queryCache } from 'react-query'

import { TopBar, OffCanvasNav } from 'components/nav'
import { MapWrap } from 'components/map'
import { AboutPageView, WelcomeDialog } from 'components/about'
import { ResultsModal } from 'components/results'
import { fetchAbout, fetchGlossary, fetchWelcome } from 'components/about/utils'
import { paths as routes } from 'components/config/routes'
import {
  ABOUT_QUERY,
  GLOSSARY_QUERY,
  WELCOME_QUERY,
} from 'components/about/config'

export const App: FC = () => {
  useEffect(() => {
    queryCache.prefetchQuery(WELCOME_QUERY, fetchWelcome)
    queryCache.prefetchQuery(ABOUT_QUERY, fetchAbout)
    queryCache.prefetchQuery(GLOSSARY_QUERY, fetchGlossary)
  }, [])

  return (
    <>
      <OffCanvasNav />
      <TopBar />
      {!window.localStorage.hideWelcome && (
        <WelcomeDialog queryName={WELCOME_QUERY} />
      )}
      <Route path={routes.about}>
        <AboutPageView queryName={ABOUT_QUERY} />
      </Route>
      <Route path={routes.table}>
        <ResultsModal />
      </Route>
      <Route path={routes.glossary}>
        <AboutPageView queryName={GLOSSARY_QUERY} />
      </Route>
      <MapWrap />
    </>
  )
}
