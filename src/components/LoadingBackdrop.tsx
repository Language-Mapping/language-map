import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdropRoot: {
      color: '#fff',
      flexDirection: 'column',
      textAlign: 'center',
      zIndex: theme.zIndex.drawer + 1,
    },
    backdropContent: {
      [theme.breakpoints.down('sm')]: {
        position: 'absolute',
        height: '100%',
        top: '25%',
      },
    },
    text: {
      textShadow: '1px 1px 5px #444',
      marginBottom: theme.spacing(1),
    },
  })
)

export const LoadingBackdrop: FC = () => {
  const classes = useStyles()

  return (
    <Backdrop className={classes.backdropRoot} open>
      <div className={classes.backdropContent}>
        <Typography variant="h4" component="h2" className={classes.text}>
          Loading...
        </Typography>
        <CircularProgress color="inherit" size={38} />
      </div>
    </Backdrop>
  )
}
