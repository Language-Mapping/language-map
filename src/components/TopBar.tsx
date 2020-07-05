import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core'
import { MdMenu } from 'react-icons/md'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

export const TopBar: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MdMenu />
          </IconButton>
          <Typography
            variant="h5"
            component="h1"
            className={classes.title}
            align="center"
          >
            Languages of New York City
          </Typography>
          {/* Empty placeholder to keep flexbox intact */}
          <div></div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
