import React, { FC } from 'react'

import { GlobalProvider } from 'components'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'

export const App: FC = () => {
  return (
    <GlobalProvider>
      <Map {...initialMapState} />
    </GlobalProvider>
  )
}
