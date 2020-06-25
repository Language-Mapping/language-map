import React from 'react'
import { render } from '@testing-library/react'
import { App } from 'components'

test('App is in the DOM using legit initial map state', async () => {
  const component = await render(<App />)
  expect(component.container).toBeInTheDocument()
})
