import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router } from 'react-router-dom'

import * as serviceWorker from './serviceWorker'
import { GlobalProvider } from 'components'
import { theme, GlobalCss } from 'config/theme'
import { App } from 'components'

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
