import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Backdrop,
} from '@material-ui/core'

import { MarkdownWithRouteLinks, useUItext, Logo } from 'components/generic'
import { WelcomeFooter } from './WelcomeFooter'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      backgroundColor: 'rgb(0 0 0 / 75%)', // makes map more obscure
    },
    dialogTitle: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '0.25rem',
      [theme.breakpoints.down('sm')]: {
        padding: '0.75rem',
      },
    },
    logoInner: {
      display: 'inline-flex',
      flexDirection: 'column',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '3rem',
        '& svg': {
          height: '3.5rem', // needs more height than the main logo on mobile
        },
      },
    },
    subSubTitle: {
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
      fontSize: '0.75rem',
    },
    dialogContent: {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        '& p': {
          fontSize: '0.9rem',
        },
      },
    },
    // Squeeze a bit more room out of the dialog
    paper: {
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

const WelcomeDialogTitle: FC = () => {
  const classes = useStyles()
  const { logoInner, subSubTitle } = classes

  return (
    <Typography variant="h2">
      <div className={logoInner}>
        <Logo darkTheme />
        <Typography variant="caption" className={subSubTitle}>
          An urban language map
        </Typography>
      </div>
    </Typography>
  )
}

export const WelcomeDialog: FC = () => {
  const classes = useStyles()
  const { dialogContent, paper, dialogTitle, backdrop } = classes
  const [open, setOpen] = useState<boolean>(true)
  const { text, error, isLoading } = useUItext('welcome-dialog')
  const handleClose = () => setOpen(false)

  let Content

  // data-testid="about-page-backdrop" // TODO: something?
  if (isLoading) return <Backdrop open />

  if (error) {
    Content = (
      <>
        An error has occurred.{' '}
        <span role="img" aria-label="man shrugging emoji">
          🤷‍♂
        </span>
      </>
    )
  } else {
    Content = <MarkdownWithRouteLinks rootElemType="p" text={text} />
  }

  // TODO: wire up Sentry; aria; TS for error (`error.message` is a string)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      disableBackdropClick
      aria-labelledby="welcome-dialog-title"
      aria-describedby="welcome-dialog-description"
      maxWidth="sm"
      BackdropProps={{ classes: { root: backdrop } }}
      PaperProps={{ classes: { root: paper }, elevation: 24 }}
    >
      <DialogTitle disableTypography className={dialogTitle}>
        <WelcomeDialogTitle />
      </DialogTitle>
      <DialogContent dividers className={dialogContent}>
        {Content}
      </DialogContent>
      <WelcomeFooter handleClose={handleClose} />
    </Dialog>
  )
}
