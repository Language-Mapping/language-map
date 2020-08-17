import React, { FC, useState } from 'react'
import { Dialog } from '@material-ui/core'

import { useStyles } from '../filters/config.styles'

export const ResultsModal: FC = (props) => {
  const { children } = props
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(true)

  const handleClose = () => {
    setOpen(false)
    // TODO: why so hard?
  }

  return (
    <Dialog
      open={open}
      className={`${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="xl"
    >
      {/* TODO: restore? */}
      {/* <Typography className={classes.featureCount}>
        Showing {langFeatures.length} of {langFeaturesCached.length} language
        communities.
      </Typography> */}
      {children}
    </Dialog>
  )
}
