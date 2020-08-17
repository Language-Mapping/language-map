import React, { FC } from 'react'
import { Route } from 'react-router-dom'

import { TopBar } from 'components/nav'
import { MapWrap } from 'components/map'
import { RouteLocation } from 'components/map/types'
import { AboutPageView } from 'components/about'
import { ResultsTable, ResultsModal } from 'components/results'

const DATA_TABLE_PATH: RouteLocation = '/table'

export const App: FC = () => {
  return (
    <>
      <TopBar />
      <main>
        <Route path="/about">
          <AboutPageView />
        </Route>
        <Route path={DATA_TABLE_PATH}>
          <ResultsModal>
            <ResultsTable />
          </ResultsModal>
        </Route>
        <MapWrap />
      </main>
    </>
  )
}
