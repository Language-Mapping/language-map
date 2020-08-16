import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Dialog } from '@material-ui/core'

// TODO: rm if not using
// import { IconButton } from '@material-ui/core'
// import { MdClose } from 'react-icons/md'

import { useTableStyles } from '../filters/config.styles'

type ResultsModalComponent = {
  children: React.ReactNode
  setResultsModalOpen: React.Dispatch<boolean>
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
    },
    closeBtn: {
      position: 'absolute',
      zIndex: 1,
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    defsModalTrigger: {
      alignItems: 'center',
      color: theme.palette.info.main,
      display: 'flex',
      fontSize: 12,
      justifyContent: 'flex-end',
      marginTop: theme.spacing(1),
      '& > svg': {
        marginRight: 4,
      },
    },
  })
)

export const ResultsModal: FC<ResultsModalComponent> = ({
  children,
  setResultsModalOpen,
}) => {
  const classes = useStyles()
  const sharedTableClasses = useTableStyles()

  const handleClose = () => {
    setResultsModalOpen(false)
  }

  return (
    <Dialog
      open
      fullScreen
      className={`${sharedTableClasses.tableRoot} ${classes.resultsModalRoot}`}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="md"
    >
      {/* <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton> */}
      {/* <Typography className={classes.featureCount}>
        Showing {langFeatures.length} of {langFeaturesCached.length} language
        communities.
      </Typography> */}
      {children}
    </Dialog>
  )
}
