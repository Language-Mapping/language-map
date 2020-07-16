import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'

import { TopBar } from 'components'
import { StyleGuide } from 'components/style-guide'
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
          <Route path="/style-guide">
            <StyleGuide />
          </Route>
        </Switch>
        <Route path="/">
          <MapWrap />
        </Route>
      </main>
    </>
  )
}
