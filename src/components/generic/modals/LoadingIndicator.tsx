import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, CircularProgress, LinearProgress } from '@material-ui/core'
import { PanelContentSimple } from 'components/panels'

type LoadingProps = {
  omitText?: boolean
}

type LoadingIndicatorProps = LoadingProps & {
  size?: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      margin: '0 auto',
      textAlign: 'center',
      maxWidth: '80%',
    },
    loadingText: {
      marginBottom: theme.spacing(2),
    },
    bar: {
      height: 2,
      borderRadius: 15,
    },
  })
)

const LoadingText: FC = () => {
  const classes = useStyles()

  return (
    <Typography variant="h5" component="p" className={classes.loadingText}>
      Loading...
    </Typography>
  )
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = (props) => {
  const { size = 40, omitText } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {!omitText && <LoadingText />}
      <CircularProgress color="inherit" size={size} />
    </div>
  )
}

export const LoadingIndicatorBar: FC<LoadingProps> = (props) => {
  const { omitText } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {!omitText && <LoadingText />}
      <LinearProgress classes={{ root: classes.bar }} />
    </div>
  )
}

export const LoadingIndicatorPanel: FC<LoadingProps> = (props) => {
  return (
    <PanelContentSimple>
      <LoadingIndicatorBar />
    </PanelContentSimple>
  )
}
