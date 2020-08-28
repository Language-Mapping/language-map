import React, { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  ListItemIcon,
  List,
  Divider,
  ListItem,
  ListItemText,
  Box,
  FormControlLabel,
  Switch,
} from '@material-ui/core'
import { FiShare } from 'react-icons/fi'
import { GoGear } from 'react-icons/go'

import { ShareButtons } from 'components'
import { primaryNavConfig } from './config'

type ListItemComponent = {
  url: string
  primaryText: string
  secondaryText: string
  icon: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listLink: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      width: '100%',
      height: '100%',
      '& svg': {
        width: 30,
        height: 30,
      },
    },
    icon: {
      minWidth: 'auto', // override default
      marginRight: theme.spacing(1),
    },
    settings: {
      padding: theme.spacing(2),
    },
  })
)

const NavListLink: FC<ListItemComponent> = ({
  url,
  primaryText,
  secondaryText,
  icon,
}) => {
  const classes = useStyles()

  return (
    <Link to={url} className={classes.listLink}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText primary={primaryText} secondary={secondaryText} />
    </Link>
  )
}

export const Nav: FC = () => {
  const classes = useStyles()
  const [showWelcomeChecked, setShowWelcomeChecked] = useState(
    !window.localStorage.hideWelcome
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      delete window.localStorage.hideWelcome
    } else {
      window.localStorage.hideWelcome = true
    }

    setShowWelcomeChecked(event.target.checked)
  }

  return (
    <>
      <nav>
        <List>
          {primaryNavConfig.map((props: ListItemComponent) => (
            <ListItem button key={props.primaryText}>
              <NavListLink {...props} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </nav>
      <Box className={classes.settings}>
        <h3>
          <FiShare /> Share
        </h3>
        <ShareButtons />
        <h3>
          <GoGear />
          Settings
        </h3>
        {/* <p>Light/dark theme</p> */}
        <FormControlLabel
          control={
            <Switch
              checked={showWelcomeChecked}
              onChange={handleChange}
              name="show-welcome-switch"
            />
          }
          label="Show welcome dialog on startup"
        />
      </Box>
    </>
  )
}
