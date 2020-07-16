import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

export const AboutPageView: FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const handleClose = () => {
    history.push('/')
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="about-page-dialog-title"
      aria-describedby="about-page-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="about-page-dialog-title">
        <Typography variant="h2">About</Typography>
      </DialogTitle>
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent dividers>
        <DialogContentText id="about-page-dialog-description">
          Incididunt non nostrud in eu excepteur proident ullamco. Dolore
          pariatur deserunt laboris nisi adipisicing et enim eiusmod deserunt
          culpa dolor. Culpa velit anim ut ullamco ipsum tempor sint Lorem do
          in.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Back to map
        </Button>
      </DialogActions>
    </Dialog>
  )
}
