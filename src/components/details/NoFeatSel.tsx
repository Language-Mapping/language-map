import React, { FC } from 'react'
import { Typography } from '@material-ui/core'

import { useStyles } from './styles'
import { RandomLinkBtn } from './RandomLinkBtn'

export const NoFeatSel: FC<{ reason?: string }> = (props) => {
  const { reason = 'No community selected.' } = props
  const classes = useStyles()

  return (
    <div style={{ textAlign: 'center', maxWidth: '85%', margin: '16px auto' }}>
      <Typography className={classes.noFeatSel}>
        {reason} Click a community in the map or in the data table.
      </Typography>
      <RandomLinkBtn />
    </div>
  )
}
