import React, { FC } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'

import { useStyles } from './ResultsToolbar'

export const LocalColumnTitle: FC<{ text: string }> = (props) => {
  const { text } = props
  const classes = useStyles()

  return (
    <div className={classes.localIndicator}>
      <FaMapMarkerAlt /> {text}
    </div>
  )
}
