import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'

import { TopBar } from 'components/nav'
import { MapWrap } from 'components/map'
import { AboutPageView } from '../views/AboutPageView'

export const App: FC = () => {
  return (
    <>
      <TopBar />
      <main>
        <Switch>
          <Route path="/about">
            <AboutPageView />
          </Route>
        </Switch>
        <Route path="/">
          <MapWrap />
        </Route>
      </main>
    </>
  )
}
