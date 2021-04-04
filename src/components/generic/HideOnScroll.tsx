import React, { FC } from 'react'
import { Fade } from '@material-ui/core'

import { useHideOnScroll } from './hooks'

type HideOnScrollProps = {
  children: React.ReactElement
  panelRefElem: HTMLDivElement | null
  threshold?: number
}

export const HideOnScroll: FC<HideOnScrollProps> = (props) => {
  const { children, panelRefElem } = props

  const hide = useHideOnScroll(panelRefElem)

  return (
    <Fade appear={false} in={!hide} timeout={300}>
      <div>{children}</div>
    </Fade>
  )
}
