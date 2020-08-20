import React, { FC } from 'react'
import { Route } from 'react-router-dom'

import { TopBar } from 'components/nav'
import { MapWrap } from 'components/map'
import { RouteLocation } from 'components/map/types'
import { AboutPageView, GlossaryDialog } from 'components/about'
import { ResultsTable, ResultsModal } from 'components/results'

const DATA_TABLE_PATHNAME: RouteLocation = '/table'
const GLOSSARY_PATHNAME: RouteLocation = '/glossary'

export const App: FC = () => {
  return (
    <>
      <TopBar />
      <main>
        <Route path="/about">
          <AboutPageView />
        </Route>
        <Route path={DATA_TABLE_PATHNAME}>
          <ResultsModal>
            <ResultsTable />
          </ResultsModal>
        </Route>
        <Route path={GLOSSARY_PATHNAME}>
          <GlossaryDialog />
        </Route>
        <MapWrap />
      </main>
    </>
  )
}
