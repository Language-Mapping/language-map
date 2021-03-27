import React, { FC, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FormControlLabel, Switch, Typography } from '@material-ui/core'
import { FiShare } from 'react-icons/fi'
import { GoGear } from 'react-icons/go'

import { ShareButtons } from 'components/generic'

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
    <>
      <Typography component="h3" className={settingsHeading}>
        <FiShare /> Share this project
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
    </>
  )
}
