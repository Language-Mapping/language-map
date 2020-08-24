import React, { FC, useEffect, useState } from 'react'
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

import { fetchContentFromWP } from './utils'
import { wpAPIsettings } from './config'
import { RemoteContentState } from './types'

const GLOSSARY_WP_URL = `${wpAPIsettings.pageUrl}/${wpAPIsettings.glossaryPageID}`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    glossaryRoot: {
      // e.g. the world map
      '& img': {
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '95%',
      },
    },
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

export const GlossaryDialog: FC = () => {
  const classes = useStyles()
  const history = useHistory()

  // TODO: learn how to use undefined or null as the initial/default type rather
  // than creating an object for the sake of TS.
  const [glossaryContent, setGlossaryContent] = useState<RemoteContentState>({
    title: null,
    content: null,
  })
  const contentReady =
    glossaryContent.title !== null && glossaryContent.content !== null

  const handleClose = () => {
    history.goBack() // TODO: something less gross?
  }

  useEffect(() => {
    fetchContentFromWP(GLOSSARY_WP_URL, setGlossaryContent)
  }, [])

  if (!contentReady) {
    // TODO: give this component an aria-something
    return (
      <Backdrop
        className={classes.backdrop}
        open
        onClick={handleClose}
        data-testid="about-page-backdrop"
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Dialog
      className={classes.glossaryRoot}
      open
      onClose={handleClose}
      aria-labelledby="glossary-page-dialog-title"
      aria-describedby="glossary-page-dialog-description"
      maxWidth="md"
    >
      <DialogTitle id="glossary-page-dialog-title" disableTypography>
        <Typography variant="h2">{glossaryContent?.title}</Typography>
      </DialogTitle>
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent dividers>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={createMarkup(glossaryContent.content || '')}
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
