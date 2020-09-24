import React from 'react'
import { Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

export const SlideUp = React.forwardRef(function Transition(
  // Don't care, came straight from the MUI example
  // eslint-disable-next-line react/require-default-props, @typescript-eslint/no-explicit-any
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})
