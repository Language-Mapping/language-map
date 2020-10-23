import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { BrowserRouter as Router } from 'react-router-dom'
import WebFont from 'webfontloader'

import { App, ProvidersWrap } from 'components'
import {
  fontFamilies as families,
  fontUrls as urls,
} from 'components/config/fonts'
import * as serviceWorker from './serviceWorker'

const SENTRY_DSN =
  'https://fff4ab9699284c8489f9890aa8aa4609@o416804.ingest.sentry.io/5313356'
// const history = createBrowserHistory() // TODO: export and use for `Back`?

// Init error tracking
Sentry.init({
  dsn: SENTRY_DSN,
  // Netlify's contexts are `production` and `deploy-preview` but React needs
  // the `REACT_APP_` prefix, so these are set in netlify.toml file.
  // TODO: is it really needed or just better practice to use `process`? What if
  // `window.location` was used instead?
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
})

// TODO: should this get broken out so that the main 2 are loaded here and the
// custom ones go go into a lower component instead? They're not really needed
// on load for the most part...
WebFont.load({
  google: {
    families: ['Noto Sans:ital,wght@0,400;0,700;1,400'],
  },
  // CRED: https://stackoverflow.com/a/50073148/1048518
  custom: {
    families,
    urls,
  },
})

const AppWrap: FC = () => (
  <React.StrictMode>
    <ProvidersWrap>
      <Router>
        <App />
      </Router>
    </ProvidersWrap>
  </React.StrictMode>
)

ReactDOM.render(<AppWrap />, document.getElementById('root'))

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept()
}
/* eslint-enable @typescript-eslint/ban-ts-comment */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
