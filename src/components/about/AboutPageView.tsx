import React, { FC } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useTheme } from '@material-ui/core/styles'
import {
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'

import { SlideUp, LoadingBackdrop } from 'components/generic/modals'
import * as Types from './types'
import { useStyles } from './styles'
import { createMarkup } from '../../utils'
import { LocWithState } from '../config/types'

export const AboutPageView: FC<Types.AboutPageProps> = (props) => {
  const { queryKey, icon, title } = props
  const classes = useStyles()
  const history = useHistory()
  const {
    pathname: currPathname,
    state: locState,
  } = useLocation() as LocWithState
  const theme = useTheme()
  const lilGuy = useMediaQuery(theme.breakpoints.only('xs'))
  const { data, isFetching, error } = useQuery(queryKey)
  const wpData = data as Types.WpApiPageResponse

  if (isFetching)
    return (
      <LoadingBackdrop
        centerOnScreen
        text="" // default "Loading..." text kind of annoying here
        testID={`${title?.replace(' ', '').toLowerCase()}-page-backdrop`}
      />
    )

  // Go back in history if route wasn't table-based, otherwise go home. Also
  // avoids an infinite cycle of table-help-table backness.
  // TODO: see notes in ResultsModal
  const handleClose = (): void => {
    if (locState?.from)
      history.push({
        pathname: locState.from,

        state: {
          from: currPathname,
        },
      })
    else history.goBack()
  }

  // TODO: wire up Sentry; aria; TS for error (`error.message` is a string)
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

  // TODO: use `keepMounted` for About for SEO purposes?
  // TODO: consider SimpleDialog for some or all of these
  return (
    <Dialog
      open
      fullScreen={lilGuy}
      onClose={handleClose}
      aria-labelledby={`${queryKey}-dialog-title`}
      aria-describedby={`${queryKey}-dialog-description`}
      TransitionComponent={SlideUp}
      maxWidth="md"
    >
      <DialogTitle id={`${queryKey}-dialog-title`} disableTypography>
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
          id={`${queryKey}-dialog-description`}
        />
      </DialogContent>
    </Dialog>
  )
}
