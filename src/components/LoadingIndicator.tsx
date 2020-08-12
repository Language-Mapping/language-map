import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingIndicatorRoot: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: 'center',
    },
    loadingText: {
      marginBottom: theme.spacing(2),
    },
  })
)

export const LoadingIndicator: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.loadingIndicatorRoot}>
      <Typography variant="h5" className={classes.loadingText}>
        Loading...
      </Typography>
      <CircularProgress color="inherit" />
    </div>
  )
}
