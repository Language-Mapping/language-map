import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      flexDirection: 'column',
    },
    text: {
      marginBottom: theme.spacing(1),
    },
  })
)

export const LoadingBackdrop: FC = () => {
  const classes = useStyles()

  return (
    <Backdrop className={classes.backdrop} open>
      <Typography variant="h4" component="h2" className={classes.text}>
        Loading...
      </Typography>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
