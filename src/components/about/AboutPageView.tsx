import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import {
  useMediaQuery,
  Backdrop,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { WpApiPageResponse, WpQueryNames } from './types'
import { createMarkup } from '../../utils'

type AboutPageProps = {
  queryName: WpQueryNames
  icon?: React.ReactNode
  title?: string
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
    dialogTitle: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        fontSize: '0.7em',
        marginRight: '0.15em',
      },
    },
    dialogContent: {
      '& img': {
        height: 'auto',
        margin: '1em auto',
        maxWidth: '90%',
        // Prevent screenshots from getting lost in Paper bg if same color:
        outline: 'solid 1px hsl(0deg 0% 40%)',
        [theme.breakpoints.only('xs')]: {
          margin: '0.5em 0',
          maxWidth: '100%',
        },
      },
      '& figure': {
        margin: '1em', // horiz. margin defaults to huge 40px in Chrome
        textAlign: 'center',
        [theme.breakpoints.only('xs')]: {
          margin: 0,
        },
      },
    },
  })
)

export const AboutPageView: FC<AboutPageProps> = (props) => {
  const { queryName, icon, title } = props
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))
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

  // TODO: use `keepMounted` for About for SEO purposes
  // TODO: consider SimpleDialog for some or all of these
  return (
    <Dialog
      open
      fullScreen={lilGuy}
      onClose={handleClose}
      aria-labelledby={`${queryName}-dialog-title`}
      aria-describedby={`${queryName}-dialog-description`}
      maxWidth="md"
    >
      <DialogTitle id={`${queryName}-dialog-title`} disableTypography>
        <Typography variant="h3" component="h2" className={classes.dialogTitle}>
          {icon}
          {title}
        </Typography>
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
    </Dialog>
  )
}
