import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { App } from 'components'
import { ProvidersWrap } from 'components/context'
import { PAGE_HEADER_ID } from 'components/nav/config'

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
    <MemoryRouter initialEntries={['/Info/About']}>
      <App />
    </MemoryRouter>
  </ProvidersWrap>
)

// NOTE: none of these tests really do much except cause problems. They were
// written with a well-intended but uniformed motivation. At least the CI is
// wired up for future use.
describe('Testing routes', () => {
  test('title element links to home', async () => {
    await render(renderApp())

    const aboutPageBackdrop = screen.getByTestId('about-page-backdrop')
    const homeTitleLink = screen.getByTestId(PAGE_HEADER_ID)

    // Starting from /About page should have a backdrop, at least in tests.
    // Couldn't figure out how to get the useEffect fetch to show the WP output,
    // but that was kinda shaky approach anyway since the title is not
    // guaranteed. Probably a better approach out there...
    // TODO: learn how to make ^^^this^^^ happen
    expect(aboutPageBackdrop).toBeInTheDocument()

    fireEvent.click(homeTitleLink)

    expect(aboutPageBackdrop).not.toBeInTheDocument()
  })
})
