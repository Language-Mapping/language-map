import React, { FC } from 'react'

import { ReadMore } from 'components/generic'
import { useDescription } from 'components/results/hooks'

// Pretty generic component-wise, and could be adapted to do non-Language stuff,
// but this was convenient for hook usage and it's the only case so far.
export const ReadMoreLangDescrip: FC<{ langDescripID: string }> = (props) => {
  const { langDescripID } = props
  const { data, isLoading, error } = useDescription(
    'Language Descriptions',
    langDescripID
  )

  if (isLoading || error || !data.length) return null

  const { Description } = data[0]

  return <ReadMore text={Description} />
}
