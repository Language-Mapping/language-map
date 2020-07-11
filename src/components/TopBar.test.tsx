import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { TopBar } from 'components'

// Hoist helper functions (but not vars) to reuse between test cases
const renderComponent = () => (
  // Only needed because there are <Link> components
  <MemoryRouter>
    <TopBar />
  </MemoryRouter>
)

describe('Testing off-canvas behavhior', () => {
  test('off-canvas nav menu toggle', async () => {
    await render(renderComponent())

    const burger = screen.getByLabelText('menu')
    fireEvent.click(burger)

    const navList = screen.getByRole('navigation')
    const backdrop = screen.getByTestId('backdrop')

    expect(navList).toBeInTheDocument()
    fireEvent.click(backdrop)

    // Nav menu closed
    await waitFor(() => {
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })
  })
})
