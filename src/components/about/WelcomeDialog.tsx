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
  Checkbox,
  Typography,
  FormControlLabel,
} from '@material-ui/core'

import { WpApiPageResponse, WpQueryNames } from './types'

type AboutPageProps = {
  queryName: WpQueryNames
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
)

const createMarkup = (content: string): { __html: string } => ({
  __html: content,
})

export const WelcomeDialog: FC<AboutPageProps> = (props) => {
  const { queryName } = props
  const classes = useStyles()
  const history = useHistory()
  const { data, isFetching, error } = useQuery(queryName)
  const wpData = data as WpApiPageResponse
  const [hasAcceptedTerms, setHasAcceptedTerms] = React.useState(
    window.localStorage.acceptedTerms
  )
  const [open, setOpen] = React.useState<boolean>(true)
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(
    !window.localStorage.hideWelcome
  )

  const handleTermsBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasAcceptedTerms(event.target.checked)
  }

  // TODO: aria-something
  if (isFetching) {
    return (
      <Backdrop
        className={classes.backdrop}
        open
        data-testid="about-page-backdrop"
      />
    )
  }

  const handleClose = () => {
    setOpen(false)
    history.push('/')
    window.localStorage.acceptedTerms = true
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

  // const { acceptedTerms, hideWelcome } = window.localStorage
  const handleShowOnStartupChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      delete window.localStorage.hideWelcome
    } else {
      window.localStorage.hideWelcome = true
    }
    setShowWelcomeModal(event.target.checked)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      aria-labelledby={`${queryName}-dialog-title`}
      aria-describedby={`${queryName}-dialog-description`}
      maxWidth="md"
    >
      <DialogTitle id={`${queryName}-dialog-title`} disableTypography>
        <Typography variant="h2">{wpData && wpData.title.rendered}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={createMarkup(
            (wpData && wpData.content.rendered) || ''
          )}
          id={`${queryName}-dialog-description`}
        />
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasAcceptedTerms}
              onChange={handleTermsBoxChange}
              name="accept-terms"
              color="primary"
            />
          }
          label="I accept terms"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showWelcomeModal}
              onChange={handleShowOnStartupChange}
              name="show on startup"
              color="primary"
            />
          }
          label="Show on startup"
        />
        <Button
          disabled={!hasAcceptedTerms}
          onClick={handleClose}
          color="primary"
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  )
}
