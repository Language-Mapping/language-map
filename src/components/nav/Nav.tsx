import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { GoInfo } from 'react-icons/go'
import { MdChat } from 'react-icons/md'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { routes } from 'components/config/api'
import { Settings } from './Settings'

type NavProps = {
  openFeedbackModal: () => void
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
    listItemIcon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1),
      minWidth: 'auto', // override default
    },
    smallerText: {
      fontSize: '0.8rem',
    },
  })
)

export const Nav: FC<NavProps> = (props) => {
  const { openFeedbackModal } = props
  const classes = useStyles()
  const { listLink, listItemIcon, smallerText } = classes

  return (
    <>
      <nav>
        <List>
          <ListItem button>
            <Link
              underline="none"
              component={RouterLink}
              to={routes.about}
              className={listLink}
            >
              <ListItemIcon className={listItemIcon}>
                <GoInfo />
              </ListItemIcon>
              <ListItemText
                classes={{ secondary: smallerText }}
                primary="About"
                secondary="Project background, credits, data sources, and legal info"
              />
            </Link>
          </ListItem>
          <ListItem button>
            <Link
              underline="none"
              href="#"
              className={listLink}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                openFeedbackModal()
              }}
            >
              <ListItemIcon className={listItemIcon}>
                <MdChat />
              </ListItemIcon>
              <ListItemText
                classes={{ secondary: smallerText }}
                primary="Contact & Feedback"
                secondary="Suggest corrections, report bugs, request new features, and more"
              />
            </Link>
          </ListItem>
          <ListItem button>
            <Link
              underline="none"
              component={RouterLink}
              to={routes.help}
              className={listLink}
            >
              <ListItemIcon className={listItemIcon}>
                <AiOutlineQuestionCircle />
              </ListItemIcon>
              <ListItemText
                classes={{ secondary: smallerText }}
                primary="Help"
                secondary="Usage instructions and a glossary of terms used in this application"
              />
            </Link>
          </ListItem>
        </List>
        <Divider />
      </nav>
      <Settings smallerTextClass={smallerText} />
    </>
  )
}
