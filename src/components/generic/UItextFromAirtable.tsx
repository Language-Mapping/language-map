import React, { FC } from 'react'

import { MarkdownWithRouteLinks, useUItext } from 'components/generic'
import { UItextFromAirtableProps } from './types'

export const UItextFromAirtable: FC<UItextFromAirtableProps> = (props) => {
  const { id, rootElemType } = props
  const { text, error, isLoading } = useUItext(id)

  if (error || isLoading) return null

  return <MarkdownWithRouteLinks rootElemType={rootElemType} text={text} />
}
