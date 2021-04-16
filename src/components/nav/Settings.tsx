import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Switch, Typography } from '@material-ui/core'
import { FiShare } from 'react-icons/fi'
import { GoGear } from 'react-icons/go'

import { ShareButtons } from 'components/generic'
import { HIDE_WELCOME_LOCAL_STG_KEY } from 'components/about'

type SettingsProps = {
  smallerTextClass: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingsHeading: {
      alignItems: 'center',
      display: 'flex',
      margin: '1rem 0',
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
  const { switchFormCtrlRoot, settingsHeading } = classes

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

  const Share = (
    <>
      <Typography component="h3" className={settingsHeading}>
        <FiShare /> Share this project
      </Typography>
      <ShareButtons />
    </>
  )

  if (localStgError) return Share

  return (
    <>
      {Share}
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
    </>
  )
}
