import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { WpApiPageResponse, WpQueryNames } from './types'

type AboutPageProps = {
  queryName: WpQueryNames
}

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
    dialogContent: {
      '& img': {
        height: 'auto',
        maxWidth: '100%',
      },
    },
  })
)

const createMarkup = (content: string): { __html: string } => ({
  __html: content,
})

export const AboutPageView: FC<AboutPageProps> = (props) => {
  const { queryName } = props
  const classes = useStyles()
  const history = useHistory()
  const { data, isFetching, error } = useQuery(queryName)
  const wpData = data as WpApiPageResponse

  // TODO: aria-something
  if (isFetching) {
    return (
      <Backdrop
        className={classes.backdrop}
        open
        data-testid="about-page-backdrop" // TODO: something?
      />
    )
  }

  const handleClose = () => {
    history.goBack() // TODO: something less gross?
  }

  // TODO: wire up Sentry
  // TODO: aria
  // TODO: TS for error (`error.message` is a string)
  if (error) {
    return (
      <Dialog open onClose={handleClose} maxWidth="md">
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
      aria-labelledby={`${queryName}-dialog-title`}
      aria-describedby={`${queryName}-dialog-description`}
      maxWidth="md"
    >
      <DialogTitle id={`${queryName}-dialog-title`} disableTypography>
        <Typography variant="h2">{wpData && wpData.title.rendered}</Typography>
      </DialogTitle>
      <IconButton onClick={handleClose} className={classes.closeBtn}>
        <MdClose />
      </IconButton>
      <DialogContent dividers className={classes.dialogContent}>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={createMarkup(
            (wpData && wpData.content.rendered) || ''
          )}
          id={`${queryName}-dialog-description`}
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
