import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  ListItemIcon,
  List,
  Divider,
  ListItem,
  ListItemText,
} from '@material-ui/core'

import { primaryNavConfig, secondaryNavConfig } from './config'

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
  return (
    <nav>
      <List>
        {primaryNavConfig.map((props: ListItemComponent) => (
          <ListItem button key={props.primaryText}>
            <NavListLink {...props} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondaryNavConfig.map((props: ListItemComponent) => (
          <ListItem button key={props.primaryText}>
            <NavListLink {...props} />
          </ListItem>
        ))}
      </List>
    </nav>
  )
}
