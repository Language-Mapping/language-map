import React, { FC } from 'react'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

import '../style.css'

import { GlobalProvider } from './GlobalContext'
import { SymbAndLabelProvider } from './SymbAndLabelContext'
import { theme } from '../config/theme'

// Everything the app needs except Routes. This makes it testable and reusable
// (e.g. <MemoryRouter>)
export const ProvidersWrap: FC = ({ children }) => {
  // TODO: rm if not using Dark/light switch, otherwise wire up
  // https://stackoverflow.com/a/61986784
  // https://medium.com/heuristics/react-dark-mode-switch-in-material-ui-dashboard-82fcf1cded66
  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SymbAndLabelProvider>{children}</SymbAndLabelProvider>
      </ThemeProvider>
    </GlobalProvider>
  )
}
