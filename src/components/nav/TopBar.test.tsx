import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { TopBar } from 'components/nav'

// Hoist helper functions (but not vars) to reuse between test cases
const renderTopBar = () => (
  // Only needed because there are <Link> components
  <MemoryRouter>
    <TopBar />
  </MemoryRouter>
)

describe('Formerly testing off-canvas behavhior', () => {
  test('off-canvas nav menu toggle', async () => {
    await render(renderTopBar())

    const navList = screen.queryByRole('navigation')

    expect(navList).not.toBeInTheDocument()
  })
})
