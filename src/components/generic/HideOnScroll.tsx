import React, { FC } from 'react'
import Slide from '@material-ui/core/Slide'

import { useHideOnScroll } from './hooks'

type HideOnScrollProps = {
  children: React.ReactElement
  panelRefElem: HTMLDivElement | null
  threshold?: number
}

export const HideOnScroll: FC<HideOnScrollProps> = (props) => {
  const { children, panelRefElem } = props

  const hide = useHideOnScroll(panelRefElem, 125)

  return (
    <Slide direction="down" appear={false} in={!hide}>
      <div>{children}</div>
    </Slide>
  )
}
