import React, { FC, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { queryCache } from 'react-query'

import { TopBar, OffCanvasNav } from 'components/nav'
import { MapWrap } from 'components/map'
import { RouteLocation } from 'components/map/types'
import { AboutPageView } from 'components/about'
import { WpQueryNames } from 'components/about/types'

import { ResultsTable, ResultsModal } from 'components/results'
import { fetchAbout, fetchGlossary, fetchWelcome } from 'components/about/utils'

const DATA_TABLE_PATHNAME: RouteLocation = '/table'
const GLOSSARY_PATHNAME: RouteLocation = '/glossary'
const ABOUT_PATHNAME: RouteLocation = '/about'
const ABOUT_QUERY: WpQueryNames = 'about'
const GLOSSARY_QUERY: WpQueryNames = 'glossary'
const WELCOME_QUERY: WpQueryNames = 'welcome'

export const App: FC = () => {
  useEffect(() => {
    queryCache.prefetchQuery(ABOUT_QUERY, fetchAbout)
    queryCache.prefetchQuery(GLOSSARY_QUERY, fetchGlossary)
    queryCache.prefetchQuery(WELCOME_QUERY, fetchWelcome)
  }, [])

  return (
    <>
      <OffCanvasNav />
      <TopBar />
      <main>
        <Route path={ABOUT_PATHNAME}>
          <AboutPageView queryName={ABOUT_QUERY} />
        </Route>
        <Route path={DATA_TABLE_PATHNAME}>
          <ResultsModal>
            <ResultsTable />
          </ResultsModal>
        </Route>
        <Route path={GLOSSARY_PATHNAME}>
          <AboutPageView queryName={GLOSSARY_QUERY} />
        </Route>
        <MapWrap />
      </main>
    </>
  )
}
