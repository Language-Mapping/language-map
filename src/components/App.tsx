import React, { FC } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { GlobalProvider } from 'components'
import { theme, GlobalCss } from 'config/theme'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'
import { StyleGuideView } from '../views/StyleGuideView'

export const App: FC = () => {
  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <Router>
          <Switch>
            <Route path="/style-guide">
              <StyleGuideView />
            </Route>
            <Route path="/">
              <Map {...initialMapState} />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </GlobalProvider>
  )
}
