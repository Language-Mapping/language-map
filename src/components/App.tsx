import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'

import { TopBar, ContainerLayout } from 'components'
import { StyleGuide } from 'components/style-guide'
import { MapWrap } from 'components/map'

export const App: FC = () => {
  return (
    <>
      <TopBar />
      <main>
        <Switch>
          <Route path="/about">
            <ContainerLayout>
              <h1>About Page</h1>
            </ContainerLayout>
          </Route>
          <Route path="/style-guide">
            <StyleGuide />
          </Route>
          <Route path="/">
            <MapWrap />
          </Route>
        </Switch>
      </main>
    </>
  )
}
