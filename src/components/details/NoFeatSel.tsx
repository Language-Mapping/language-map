import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { routes } from 'components/config/api'
import { Explanation } from 'components/generic'
import { PanelHeading } from 'components/panels'
import { RandomLinkBtn } from './RandomLinkBtn'

export const NoFeatSel: FC<{ reason?: string }> = (props) => {
  const { reason = 'No community selected' } = props

  return (
    <>
      <PanelHeading text={reason} />
      <Explanation>
        <p>Please select a community using one of the following options:</p>
        <ul>
          <li>Click a point on the map.</li>
          <li>
            Search for a language from{' '}
            <RouterLink to={routes.home}>Home</RouterLink>.
          </li>
          <li>
            Specify a community in{' '}
            <RouterLink to={routes.table}>Data</RouterLink>.
          </li>
        </ul>
        <p>
          Or, click the button below to visit a randomly selected community.
        </p>
      </Explanation>
      <div
        style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}
      >
        <RandomLinkBtn />
      </div>
    </>
  )
}
