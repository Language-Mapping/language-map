import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { BrowserRouter } from 'react-router-dom'
import WebFont from 'webfontloader'

import { App } from 'components'
import { ProvidersWrap } from 'components/context'

const SENTRY_DSN =
  'https://fff4ab9699284c8489f9890aa8aa4609@o416804.ingest.sentry.io/5313356'

// Init error tracking
Sentry.init({
  dsn: SENTRY_DSN,
  // Netlify's contexts are `production` and `deploy-preview` but React needs
  // the `REACT_APP_` prefix, so these are set in netlify.toml file.
  // TODO: is it really needed or just better practice to use `process`? What if
  // `window.location` was used instead?
  environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
  // Ignore MB errors on baselayer change
  ignoreErrors: [/^Error: Layer with id.* does not exist on this map\.$/],
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

const container = document.getElementById('root')

if (!container) throw new Error('No #root element to mount React into')

createRoot(container).render(<AppWrap />)
