import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'

import { StyleGuide } from 'components/style-guide'
import { TopBar, ContainerLayout } from 'components'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'

export const App: FC = () => {
  return (
    <>
      <TopBar />
      <Switch>
        <Route path="/results">
          <ContainerLayout>
            <h1>Results Table</h1>
          </ContainerLayout>
        </Route>
        <Route path="/about">
          <ContainerLayout>
            <h1>About Page</h1>
          </ContainerLayout>
        </Route>
        <Route path="/style-guide">
          <StyleGuide />
        </Route>
        <Route path="/">
          <Map {...initialMapState} />
        </Route>
      </Switch>
    </>
  )
}
