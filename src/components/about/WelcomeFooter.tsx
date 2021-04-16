import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Checkbox,
  DialogActions,
  FormControlLabel,
  Typography,
} from '@material-ui/core'

import { HIDE_WELCOME_LOCAL_STG_KEY } from './config'

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

  // TODO: reuse all this between WelcomeFooter and Settings
  const [localStgError, setLocalStgError] = useState<boolean>(false)

  const [showWelcomeChecked, setShowWelcomeChecked] = useState(() => {
    try {
      return !window.localStorage.getItem(HIDE_WELCOME_LOCAL_STG_KEY)
    } catch (e) {
      setLocalStgError(true)

      return false
    }
  })

  const handleWelcomeSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const { localStorage } = window

      if (event.target.checked) {
        localStorage.removeItem(HIDE_WELCOME_LOCAL_STG_KEY)
      } else {
        localStorage.setItem(HIDE_WELCOME_LOCAL_STG_KEY, 'true')
      }
    } catch (e) {
      setLocalStgError(true)
    }

    setShowWelcomeChecked(event.target.checked)
  }

  return (
    <DialogActions className={welcomeFootRoot} disableSpacing>
      <Typography variant="caption" className={haveReadText}>
        By continuing I acknowledge that I have read and accept the above
        information.
      </Typography>
      {!localStgError && (
        <FormControlLabel
          classes={{ label: showOnStartup }}
          control={
            <Checkbox
              checked={showWelcomeChecked}
              onChange={handleWelcomeSwitchChange}
              name="show on startup"
              size="small"
            />
          }
          label="Show on startup"
        />
      )}
      <Button
        onClick={handleClose}
        color="secondary"
        variant="contained"
        className={continueBtn}
      >
        Continue
      </Button>
    </DialogActions>
  )
}
