import React, { FC } from 'react'
import { Explanation, UItextFromAirtable } from 'components/generic'
import { PanelHeading } from 'components/panels'
import { RandomLinkBtn } from './RandomLinkBtn'

export const NoFeatSel: FC<{ reason?: string }> = (props) => {
  const { reason } = props // Basically just "Community not found..."

  return (
    <>
      {reason && <PanelHeading text={reason} />}
      <Explanation>
        <UItextFromAirtable id="none-selected" />
      </Explanation>
      <div
        style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}
      >
        <RandomLinkBtn />
      </div>
    </>
  )
}
