import React, { FC } from 'react'
import { useTheme, Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import {
  Dialog,
  DialogContent,
  DialogProps,
  useMediaQuery,
} from '@mui/material'

import { DialogCloseBtn } from './DialogCloseBtn'
import { SlideUp } from './SlideUp'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: theme.spacing(3),
      [theme.breakpoints.down('md')]: {
        padding: '2rem 1rem', // make media btns fit
      },
    },
  })
)

// TODO: don't make close go back in history, or some other smooth way:
// https://stackoverflow.com/questions/47409586
export const SimpleDialog: FC<DialogProps> = (props) => {
  const { onClose, children } = props
  const classes = useStyles()
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Dialog
      aria-labelledby="simple-modal-dialog-title"
      aria-describedby="simple-modal-dialog-description"
      maxWidth="md"
      fullScreen={lilGuy}
      TransitionComponent={SlideUp}
      {...props}
    >
      <DialogCloseBtn onClose={onClose} />
      <DialogContent className={classes.dialogContent}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
