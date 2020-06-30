import React, { FC } from 'react'

import { GlobalProvider } from 'components'
import { StyleGuide } from 'components/style-guide'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'

export const App: FC = () => {
  return (
    <GlobalProvider>
      {/* TODO: wire up react-router */}
      <Map {...initialMapState} />
      <StyleGuide />
    </GlobalProvider>
  )
}
