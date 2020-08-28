import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Checkbox,
  DialogActions,
  FormControlLabel,
  Typography,
} from '@material-ui/core'

type WelcomeFooterProps = {
  handleClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    welcomeFootRoot: {
      alignItems: 'center',
      display: 'grid',
      gridRowGap: 8,
      gridTemplateRows: 'auto auto',
      padding: '10px 12px',
      gridTemplateAreas: `
      "checkbox btn"
      "text text"
      `,
      [theme.breakpoints.up('sm')]: {
        gridTemplateAreas: '"checkbox text btn"',
        gridTemplateColumns: 'auto 1fr minmax(auto, 200px)',
        gridTemplateRows: 'auto',
        justifyContent: 'space-between',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
    haveReadText: {
      color: theme.palette.text.secondary,
      fontSize: '0.75em',
      gridArea: 'text',
      justifySelf: 'flex-end',
      lineHeight: 1.4,
      marginRight: theme.spacing(1),
    },
    showOnStartup: {
      color: theme.palette.text.secondary,
      fontSize: '.75rem',
      gridArea: 'checkbox',
      marginLeft: -4, // checkbox icon has ridiculous padding, hard to override
    },
    continueBtn: {
      gridArea: 'btn',
    },
  })
)

export const WelcomeFooter: FC<WelcomeFooterProps> = (props) => {
  const { handleClose } = props
  const classes = useStyles()
  const { welcomeFootRoot, haveReadText, showOnStartup, continueBtn } = classes
  const { localStorage } = window

  const [showWelcomeModal, setShowWelcomeModal] = useState(
    !localStorage.hideWelcome
  )

  const handleShowOnStartupChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      delete window.localStorage.hideWelcome
    } else {
      localStorage.hideWelcome = true
    }

    setShowWelcomeModal(event.target.checked)
  }

  return (
    <DialogActions className={welcomeFootRoot} disableSpacing>
      <Typography variant="caption" className={haveReadText}>
        By continuing I acknowledge that I have read and accept the above
        information.
      </Typography>
      <FormControlLabel
        classes={{ label: showOnStartup }}
        control={
          <Checkbox
            checked={showWelcomeModal}
            onChange={handleShowOnStartupChange}
            name="show on startup"
            size="small"
          />
        }
        label="Show on startup"
      />
      <Button
        onClick={handleClose}
        color="primary"
        variant="contained"
        size="large"
        className={continueBtn}
      >
        Continue
      </Button>
    </DialogActions>
  )
}
