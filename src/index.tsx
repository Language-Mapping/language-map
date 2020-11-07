import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { BrowserRouter } from 'react-router-dom'
import WebFont from 'webfontloader'

import { App, ProvidersWrap } from 'components'
import * as serviceWorker from './serviceWorker'

const SENTRY_DSN =
  'https://fff4ab9699284c8489f9890aa8aa4609@o416804.ingest.sentry.io/5313356'

// Init error tracking
Sentry.init({
  dsn: SENTRY_DSN,
  // Netlify's contexts are `production` and `deploy-preview` but React needs
  // the `REACT_APP_` prefix, so these are set in netlify.toml file.
  // TODO: is it really needed or just better practice to use `process`? What if
  // `window.location` was used instead?
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
})

WebFont.load({
  google: {
    families: ['Noto Sans:ital,wght@0,400;0,700;1,400'],
  },
  // Gentium is already loaded in the CSS but this seems to avoid FOUT
  custom: {
    families: ['Gentium'],
    urls: ['/fonts/GentiumAlt.ttf'],
  },
})

const AppWrap: FC = () => (
  <React.StrictMode>
    <ProvidersWrap>
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
