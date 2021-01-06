import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { useAirtable } from './hooks'
import { CrumbResponse } from './types'

export const CurrentDetailCrumb: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useAirtable<CrumbResponse>('Data', {
    fields: ['Language', 'Primary Location'],
    filterByFormula: `{id} = ${id}`,
  })

  if (isLoading || error || !data.length) return null

  return (
    <>
      {data[0].Language}
      {` — ${data[0]['Primary Location']}`}
    </>
  )
}
