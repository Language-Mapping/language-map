import React, { FC, useState } from 'react'
import { useQuery } from 'react-query'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'

import { LoadingBackdrop } from 'components/generic/modals'
import { WpApiPageResponse } from './types'
import { WelcomeFooter } from './WelcomeFooter'
import { createMarkup } from '../../utils'
import { ReactComponent as ProjectLogo } from '../../img/logo.svg'

type AboutPageProps = {
  queryKey: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      color: '#fff',
      zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
      height: '4.5rem',
      color: theme.palette.text.primary,
      '& #title': { fill: 'currentColor' },
      '& #subtitle': { fill: 'currentColor' },
      '& #accent': { stroke: theme.palette.primary.light },
      [theme.breakpoints.up('sm')]: { height: '6rem' },
    },
    dialogTitle: {
      display: 'flex',
      justifyContent: 'center',
    },
    logoInner: {
      display: 'inline-flex',
      flexDirection: 'column',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '3rem',
      },
    },
    subSubTitle: {
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
      fontSize: '0.75rem',
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

// TODO: separate file. You know the drill.
export const Logo: FC = (props) => {
  const classes = useStyles()
  const { logo, logoInner, subSubTitle, dialogTitle } = classes

  return (
    <Typography variant="h2" className={dialogTitle}>
      <div className={logoInner}>
        <ProjectLogo className={logo} />
        <Typography variant="caption" className={subSubTitle}>
          An urban language map
        </Typography>
      </div>
    </Typography>
  )
}

export const WelcomeDialog: FC<AboutPageProps> = (props) => {
  const { queryKey } = props
  const classes = useStyles()
  const { dialogContent, welcomePaper } = classes
  const { data, isFetching, error } = useQuery(queryKey)
  const wpData = data as WpApiPageResponse
  const [open, setOpen] = useState<boolean>(true)

  // TODO: aria-something
  if (isFetching)
    return (
      <LoadingBackdrop
        data-testid="about-page-backdrop" // TODO: something?
      />
    )

  const handleClose = () => setOpen(false)

  // TODO: wire up Sentry // TODO: aria
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
      aria-labelledby={`${queryKey}-dialog-title`}
      aria-describedby={`${queryKey}-dialog-description`}
      maxWidth="md"
      PaperProps={{ className: welcomePaper }}
    >
      <DialogTitle disableTypography>
        <Logo />
      </DialogTitle>
      <DialogContent dividers className={dialogContent}>
        <div
          dangerouslySetInnerHTML={createMarkup(
            (wpData && wpData.content.rendered) || ''
          )}
          id={`${queryKey}-dialog-description`}
        />
      </DialogContent>
      <WelcomeFooter handleClose={handleClose} />
    </Dialog>
  )
}
