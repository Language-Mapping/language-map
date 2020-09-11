import React from 'react'
import { MdCheck } from 'react-icons/md'
import { GoCircleSlash } from 'react-icons/go'

import { LangRecordSchema } from '../../context/types'

export const VideoColumnCell = (
  data: LangRecordSchema
): string | React.ReactNode => {
  const { Video: video } = data

  return (
    <div style={{ paddingLeft: 16 }}>
      {video ? <MdCheck /> : <GoCircleSlash />}
    </div>
  )
}
