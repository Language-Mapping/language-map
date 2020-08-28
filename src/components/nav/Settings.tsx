import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, FormControlLabel, Switch, Typography } from '@material-ui/core'
import { FiShare } from 'react-icons/fi'
import { GoGear } from 'react-icons/go'

import { ShareButtons } from 'components'

type SettingsProps = {
  smallerTextClass: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsRoot: {
      padding: theme.spacing(2),
    },
    settingsHeading: {
      alignItems: 'center',
      display: 'flex',
      marginTop: '.75rem',
      marginBottom: '0.5rem',
      '& > svg': {
        marginRight: 4,
        color: theme.palette.text.secondary,
      },
    },
    switchFormCtrlRoot: {
      marginLeft: 0,
    },
  })
)

export const Settings: FC<SettingsProps> = (props) => {
  const { smallerTextClass } = props
  const classes = useStyles()
  const { switchFormCtrlRoot, settingsRoot, settingsHeading } = classes

  // TODO: consider using`localStorage.getItem('hideWelcome')`
  const [showWelcomeChecked, setShowWelcomeChecked] = useState(
    !window.localStorage.hideWelcome
  )

  // Consider this instead:
  // https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
  const handleWelcomeSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      delete window.localStorage.hideWelcome
    } else {
      window.localStorage.hideWelcome = true
    }

    setShowWelcomeChecked(event.target.checked)
  }

  return (
    <Box className={settingsRoot}>
      <Typography component="h3" className={settingsHeading}>
        <FiShare /> Share
      </Typography>
      <ShareButtons />
      <Typography component="h3" className={settingsHeading}>
        <GoGear />
        Settings
      </Typography>
      <FormControlLabel
        classes={{
          label: smallerTextClass,
          root: switchFormCtrlRoot,
        }}
        // Prevent off-canvas from closing (but we want that to happen for all
        // the other elements in the off-canvas).
        onClick={(event) => event.stopPropagation()}
        control={
          <Switch
            checked={showWelcomeChecked}
            onChange={handleWelcomeSwitchChange}
            name="show-welcome-switch"
            size="small"
          />
        }
        label="Show welcome screen on startup"
      />
    </Box>
  )
}
