import React, { FC } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'

import { GlobalProvider } from 'components'
import { theme, GlobalCss } from 'config/theme'

// Everything the app needs except Routes. This makes it testable and reusable
// (e.g. <MemoryRouter>)
export const ProvidersWrap: FC = ({ children }) => (
  <GlobalProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalCss />
      {children}
    </ThemeProvider>
  </GlobalProvider>
)
