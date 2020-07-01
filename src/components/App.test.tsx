import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { App } from 'components'

// TODO: figure out how to restore this without breaking the route tests. It
// looks like it freaks out because <Router> has two instances this way.
// test('App is in the DOM using legit initial map state', async () => {
//   const component = await render(<App />)
//   expect(component.container).toBeInTheDocument()
// })

// Hoist helper functions (but not vars) to reuse between test cases
const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/style-guide']}>
      <App />
    </MemoryRouter>
  )

// {/* await  */}
describe('Testing routes', () => {
  test('renders style guide route', async () => {
    await renderComponent()

    expect(screen.getByTestId('style-guide-pg-title')).toHaveTextContent(
      /style guide demo/i
    )

    fireEvent.click(screen.getByText('Home'))
    // TODO: test Home route, either as a router nav test or as a replacement to
    // the original `toBeInTheDocument` test for `<App />`
  })
})
