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
import { MdHome, MdViewList } from 'react-icons/md'
import { FaInfo } from 'react-icons/fa'

type ListItemType = {
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

const primaryNavConfig = [
  {
    url: '/',
    primaryText: 'Home',
    secondaryText: 'The main map view',
    icon: <MdHome />,
  },
  {
    url: '/results',
    primaryText: 'Table/results',
    secondaryText: 'Tabular list of results',
    icon: <MdViewList />,
  },
]

const NavListLink: FC<ListItemType> = ({
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
        {primaryNavConfig.map((props: ListItemType) => (
          <ListItem button key={props.primaryText}>
            <NavListLink {...props} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <NavListLink
            url="/about"
            primaryText="About"
            secondaryText="Privacy policy, data sources"
            icon={<FaInfo />}
          />
        </ListItem>
      </List>
    </nav>
  )
}
