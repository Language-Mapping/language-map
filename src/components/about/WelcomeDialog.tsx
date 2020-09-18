import React, { FC, useState } from 'react'
import { useQuery } from 'react-query'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles'

import {
  Backdrop,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'

import { WpApiPageResponse, WpQueryNames } from './types'
import { WelcomeFooter } from './WelcomeFooter'
import { createMarkup } from '../../utils'
import { useStyles as useTopBarStyles } from '../nav/styles'

type AboutPageProps = {
  queryName: WpQueryNames
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      color: '#fff',
      zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
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
    subtitle: {
      fontSize: '0.32em',
      marginTop: '-0.4em',
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
  const theme = useTheme()
  const classes = {
    ...useTopBarStyles({
      logoLineColor: theme.palette.primary.light,
      logoHorizPadding: '0.45em',
    }),
    ...useStyles(),
  }
  const { logo, logoInner, titleMain, subtitle, subSubTitle } = classes

  return (
    <Typography variant="h2" className={logo}>
      <div className={logoInner}>
        <span
          style={{ textShadow: 'hsl(0deg 0% 25% / 80%) 1px 1px 5px' }}
          className={titleMain}
        >
          Languages
        </span>
        <span className={subtitle}>of New York City</span>
        <Typography variant="caption" className={subSubTitle}>
          An urban language map
        </Typography>
      </div>
    </Typography>
  )
}

export const WelcomeDialog: FC<AboutPageProps> = (props) => {
  const { queryName } = props
  const classes = useStyles()
  const { backdrop, dialogContent, welcomePaper } = classes
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
      aria-labelledby={`${queryName}-dialog-title`}
      aria-describedby={`${queryName}-dialog-description`}
      maxWidth="md"
      PaperProps={{ className: welcomePaper }}
    >
      <DialogTitle disableTypography>
        <Logo />
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
