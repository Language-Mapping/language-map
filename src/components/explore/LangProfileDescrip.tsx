import React, { FC } from 'react'

import { ReadMore } from 'components/generic'
import { useAirtable } from './hooks'

export const LangProfileDescrip: FC<{ langProfileDescripID: string }> = (
  props
) => {
  const { langProfileDescripID } = props

  const { data, error, isLoading } = useAirtable<{ Description: string }>(
    // TODO: TS-ify the names of all tables
    'Language Profiles',
    // TODO: TS-ify the field names for all tables
    { filterByFormula: `{id} = '${langProfileDescripID}'` }
  )

  if (isLoading || error || !data.length) return null

  return <ReadMore text={data[0].Description} />
}
