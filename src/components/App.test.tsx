import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { ProvidersWrap, App } from 'components'

// TODO: figure out how to restore this without breaking the route tests. It
// looks like it freaks out because <Router> has two instances this way.
// eslint-disable-next-line jest/no-commented-out-tests
// test('App is in the DOM using legit initial map state', async () => {
//   const component = await render(<App />)
//   expect(component.container).toBeInTheDocument()
// })

// Hoist helper functions (but not vars) to reuse between test cases
const renderApp = () => (
  <ProvidersWrap>
    <MemoryRouter initialEntries={['/about']}>
      <App />
    </MemoryRouter>
  </ProvidersWrap>
)

describe('Testing routes', () => {
  test('title element links to home', async () => {
    await render(renderApp())

    const mainContent = screen.getByRole('main')
    const homeTitleLink = screen.getByText(/languages of new york city/i)

    // Starting from /about page should have expected heading
    expect(mainContent).toHaveTextContent(/about page/i)

    fireEvent.click(homeTitleLink)

    // TODO: get by heading somehow? Really just want <h1>
    expect(mainContent).not.toHaveTextContent(/about page/i)
  })
})
