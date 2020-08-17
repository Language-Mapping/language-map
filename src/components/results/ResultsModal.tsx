import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Dialog } from '@material-ui/core'

import { useTableStyles } from '../filters/config.styles'

type ResultsModalComponent = {
  children: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    resultsModalRoot: {
      '& .MuiDialog-paper': {
        overflowY: 'hidden',
      },
      '& .MuiPaper-root': {
        overflowY: 'hidden',
      },
      // Don't even know what this is, some kind of spacer or something to do
      // with grouping perhaps (even though it's set to `false` in the table
      // options), but either way itseems useless.
      '& > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div:nth-child(2) > div:nth-child(1)': {
        display: 'none',
      },
    },
    closeBtn: {
      position: 'absolute',
      zIndex: 1,
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

export const ResultsModal: FC<ResultsModalComponent> = ({ children }) => {
  const classes = useStyles()
  const sharedTableClasses = useTableStyles() // TODO: combine w/classes
  const [open, setOpen] = useState<boolean>(true)

  const handleClose = () => {
    setOpen(false)
    // TODO: why so hard?
  }

  return (
    <Dialog
      open={open}
      fullScreen
      className={`${sharedTableClasses.tableRoot} ${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="md"
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
