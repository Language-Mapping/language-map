import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { wpAPIsettings } from './config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
)

const createMarkup = (content: string): { __html: string } => ({
  __html: content,
})

export const AboutPageView: FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const url = `${wpAPIsettings.pageUrl}/${wpAPIsettings.pageId}`

  const { isLoading, error, data } = useQuery('aboutPage', () =>
    fetch(`${url}`).then((res) => res.json())
  )

  // TODO: give this component an aria-something
  if (isLoading) {
    return (
      <Backdrop
        className={classes.backdrop}
        open
        data-testid="about-page-backdrop"
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  const handleClose = () => {
    history.goBack() // TODO: something less gross?
  }

  // TODO: wire up Sentry
  // TODO: TS for error (`error.message` is a string)
  if (error) {
    return (
      <Dialog
        open
        onClose={handleClose}
        aria-labelledby="about-page-err-dialog-title"
        aria-describedby="about-page-err-dialog-description"
        maxWidth="md"
      >
        An error has occurred.{' '}
        <span role="img" aria-label="man shrugging emoji">
          🤷‍♂
        </span>
      </Dialog>
    )
  }

  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="about-page-dialog-title"
      aria-describedby="about-page-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="about-page-dialog-title" disableTypography>
        <Typography variant="h2">{data.title.rendered}</Typography>
      </DialogTitle>
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent dividers>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={createMarkup(data.content.rendered || '')}
          id="about-page-dialog-description"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Back to map
        </Button>
      </DialogActions>
    </Dialog>
  )
}
