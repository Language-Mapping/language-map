import React, { FC } from 'react'
import { Map } from 'components/map'
import { initialMapState } from 'components/map/config'

export const App: FC = () => {
  return <Map {...initialMapState} />
}
