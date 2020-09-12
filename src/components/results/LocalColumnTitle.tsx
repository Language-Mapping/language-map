import React, { FC } from 'react'
import { BiMapPin } from 'react-icons/bi'

import { useStyles } from './ResultsToolbar'

// TODO: could be a better icon: MdPersonPinCircle

export const LocalColumnTitle: FC<{ text: string }> = (props) => {
  const { text } = props
  const classes = useStyles()

  return (
    <div className={classes.localIndicator}>
      <BiMapPin /> {text}
    </div>
  )
}
