import React, { FC } from 'react'
import { CssBaseline } from '@mui/material'
import {
  Theme,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles'

import '../style.css'

import { GlobalProvider } from './GlobalContext'
import { SymbAndLabelProvider } from './SymbAndLabelContext'
import { theme } from '../config/theme'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// Everything the app needs except Routes. This makes it testable and reusable
// (e.g. <MemoryRouter>)
export const ProvidersWrap: FC = ({ children }) => {
  // TODO: rm if not using Dark/light switch, otherwise wire up
  // https://stackoverflow.com/a/61986784
  // https://medium.com/heuristics/react-dark-mode-switch-in-material-ui-dashboard-82fcf1cded66
  return (
    <GlobalProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SymbAndLabelProvider>{children}</SymbAndLabelProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </GlobalProvider>
  )
}
