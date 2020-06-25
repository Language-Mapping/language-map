import React from 'react'
import { render } from '@testing-library/react'

import { Map } from 'components/map'

// TODO: rm if not using
// jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   Map: () => ({}),
// }))

// TODO: rm if not using
// jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   GeolocateControl: jest.fn(),
//   Map: <Map />,
//   // Map: jest.fn(() => ({
//   //   addControl: jest.fn(),
//   //   on: jest.fn(),
//   //   remove: jest.fn(),
//   // })),
//   NavigationControl: jest.fn(),
// }))

const mapCenter = [-0, 0] as [number, number]

export const initialMapState = {
  latitude: mapCenter[1],
  longitude: mapCenter[0],
  zoom: 15,
}

describe('Detecting basic map presence', () => {
  test('Map component renders', async () => {
    const component = await render(<Map {...initialMapState} />)
    expect(component).toBeTruthy()
  })

  test('Map component is in doc', async () => {
    const component = await render(<Map {...initialMapState} />)
    expect(component.container).toBeInTheDocument()
  })
})
