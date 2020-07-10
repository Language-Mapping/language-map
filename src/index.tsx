import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import { App, ProvidersWrap } from 'components'

import * as serviceWorker from './serviceWorker'

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
