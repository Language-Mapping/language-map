import React, { FC, useContext } from 'react'
import { Link } from '@material-ui/core'
import { GlobalContext } from 'components'

import { ActivePanelIndex } from '../context/types'

type CheapLinkComponent = {
  text: string
  activePanelIndex: ActivePanelIndex
}

export const LinkToActivePanel: FC<CheapLinkComponent> = ({
  text,
  activePanelIndex,
}) => {
  const { dispatch } = useContext(GlobalContext)

  return (
    <Link
      href="javascript;"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        dispatch({ type: 'SET_ACTIVE_PANEL_INDEX', payload: activePanelIndex })
      }}
      style={{ fontWeight: 'bold' }}
    >
      {text}
    </Link>
  )
}
