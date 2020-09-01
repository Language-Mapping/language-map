import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { Dialog, DialogContent, DialogProps } from '@material-ui/core'
import { DialogCloseBtn } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    closeBtn: {
      position: 'absolute',
      zIndex: 1,
      top: 4,
      right: 4,
      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(1),
        right: theme.spacing(1),
      },
    },
  })
)

// TODO: don't make close go back in history, or some other smooth way:
// https://stackoverflow.com/questions/47409586
export const SimpleDialog: FC<DialogProps> = (props) => {
  const classes = useStyles()
  const { onClose, children } = props

  return (
    <Dialog
      aria-labelledby="simple-modal-dialog-title"
      aria-describedby="simple-modal-dialog-description"
      maxWidth="md"
      {...props}
    >
      <DialogCloseBtn onClose={onClose} />
      <DialogContent className={`${classes.dialogContent}`}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
