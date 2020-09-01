import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import WebFont from 'webfontloader'

import { App, ProvidersWrap } from 'components'
import * as serviceWorker from './serviceWorker'
import { fontFamilies as families, fontUrls as urls } from './config/fonts'

WebFont.load({
  google: {
    families: ['Gentium Basic:700', 'Noto Sans:ital,wght@0,400;0,700;1,400'],
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
