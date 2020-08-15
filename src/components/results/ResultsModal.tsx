import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { useTableStyles } from './config'

type ResultsModalComponent = {
  children: React.ReactNode
  setResultsModalOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    dialogTitle: {
      paddingTop: 12,
      paddingBottom: 12,
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
    },
    dialogContent: {
      // need all the room we can get
      paddingBottom: 0, // sticky footer pagination is weird otherwise
      paddingTop: 0,
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
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
      className={sharedTableClasses.tableRoot}
      onClose={handleClose}
      aria-labelledby="results-modal-dialog-title"
      aria-describedby="results-modal-dialog-description"
      maxWidth="md"
    >
      <DialogTitle
        id="results-modal-dialog-title"
        disableTypography
        className={classes.dialogTitle}
      >
        <Typography variant="h2">Data</Typography>
      </DialogTitle>
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent className={classes.dialogContent} dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
