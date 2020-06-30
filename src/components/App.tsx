import React, { FC } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { CssBaseline } from '@material-ui/core'

import { GlobalProvider } from 'components'
import { StyleGuide } from 'components/style-guide'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'
import { theme, GlobalCss } from 'config/theme'

export const App: FC = () => {
  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        {/* TODO: wire up react-router */}
        {/* <Map {...initialMapState} /> */}
        <StyleGuide />
      </ThemeProvider>
    </GlobalProvider>
  )
}
