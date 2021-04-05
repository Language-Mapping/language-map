import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Explanation } from 'components/generic'
import { routes } from 'components/config/api'

export const AddlLanguages: FC<{ data: string[] }> = (props) => {
  const { data = [] } = props

  return (
    <>
      <Explanation>
        Additional languages spoken in this neighborhood:
      </Explanation>
      <ul style={{ marginTop: 0 }}>
        {data.map((langName) => (
          <li key={langName}>
            <RouterLink to={`${routes.explore}/Language/${langName}`}>
              {langName}
            </RouterLink>
          </li>
        ))}
      </ul>
    </>
  )
}
