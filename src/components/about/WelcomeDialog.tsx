import React, { FC, useState } from 'react'
import { useQuery } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Backdrop,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'

import { WpApiPageResponse, WpQueryNames } from './types'
import { WelcomeFooter } from './WelcomeFooter'

type AboutPageProps = {
  queryName: WpQueryNames
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      color: '#fff',
      zIndex: theme.zIndex.drawer + 1,
    },
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[8],
      color: theme.palette.common.white,
      fontSize: '1.8rem',
      textAlign: 'center',
      textShadow: `1px 1px 3px ${theme.palette.primary.dark}`,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
    },
    dialogContent: {
      [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        '& p': {
          fontSize: '0.9rem',
        },
      },
    },
    // Squeeze a bit more room out of the dialog
    welcomePaper: {
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: 0,
        marginTop: 0,
        maxHeight: `calc(100% - ${theme.spacing(4)}px)`,
      },
    },
  })
)

const createMarkup = (content: string): { __html: string } => ({
  __html: content,
})
export const WelcomeDialog: FC<AboutPageProps> = (props) => {
  const { queryName } = props
  const classes = useStyles()
  const { backdrop, dialogTitle, dialogContent, welcomePaper } = classes
  const { data, isFetching, error } = useQuery(queryName)
  const wpData = data as WpApiPageResponse
  const [open, setOpen] = useState<boolean>(true)

  // TODO: aria-something
  if (isFetching) {
    return <Backdrop className={backdrop} open />
  }

  const handleClose = () => {
    setOpen(false)
  }

  // TODO: wire up Sentry
  // TODO: aria
  // TODO: TS for error (`error.message` is a string)
  if (error) {
    return (
      <Dialog open onClose={handleClose} maxWidth="sm">
        An error has occurred.{' '}
        <span role="img" aria-label="man shrugging emoji">
          🤷‍♂
        </span>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      disableBackdropClick
      aria-labelledby={`${queryName}-dialog-title`}
      aria-describedby={`${queryName}-dialog-description`}
      maxWidth="md"
      PaperProps={{ className: welcomePaper }}
    >
      <DialogTitle
        id={`${queryName}-dialog-title`}
        disableTypography
        className={dialogTitle}
      >
        <Typography variant="h3" component="h2">
          {wpData && wpData.title.rendered}
        </Typography>
      </DialogTitle>
      <DialogContent dividers className={dialogContent}>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={createMarkup(
            (wpData && wpData.content.rendered) || ''
          )}
          id={`${queryName}-dialog-description`}
        />
      </DialogContent>
      <WelcomeFooter handleClose={handleClose} />
    </Dialog>
  )
}
