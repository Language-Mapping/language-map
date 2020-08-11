import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ProvidersWrap } from 'components'
import { MapWrap } from 'components/map'

// TODO: rm if not using
// jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
//   GeolocateControl: jest.fn(),
//   Map: () => ({}), // or next line?
//   Map: <Map />,
//   // Map: jest.fn(() => ({
//   //   addControl: jest.fn(),
//   //   on: jest.fn(),
//   //   remove: jest.fn(),
//   // })),
//   NavigationControl: jest.fn(),
// }))

// TODO: use `initialEntries` in <MemoryRouter> to test routing
const renderComponent = () =>
  render(
    <ProvidersWrap>
      <MemoryRouter>
        <MapWrap />
      </MemoryRouter>
    </ProvidersWrap>
  )

describe('Detecting basic map presence', () => {
  test('Map component renders', async () => {
    const component = await renderComponent()
    expect(component).toBeTruthy()
  })

  test('Map component is in doc', async () => {
    const component = await renderComponent()
    expect(component.container).toBeInTheDocument()
  })
})
