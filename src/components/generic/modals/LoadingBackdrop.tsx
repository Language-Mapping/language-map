import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Backdrop, CircularProgress, Typography } from '@material-ui/core'

type LoadingBackdrop = {
  centerOnScreen?: boolean
  text?: string
  testID?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: '#fff',
      flexDirection: 'column',
      textAlign: 'center',
      zIndex: theme.zIndex.drawer + 1,
    },
    backdropContent: {
      position: 'absolute',
      top: 'calc(25% - 30px)',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        top: 'calc(50% - 50px)',
      },
    },
    text: {
      textShadow: '1px 1px 5px #444',
      marginBottom: theme.spacing(1),
    },
  })
)

export const LoadingBackdropEmpty: FC<{ open: boolean }> = (props) => {
  const { open } = props
  const classes = useStyles()

  return <Backdrop className={classes.root} open={open} />
}

export const LoadingBackdrop: FC<LoadingBackdrop> = (props) => {
  const { text = 'Loading...', testID } = props
  const classes = useStyles()

  return (
    // TODO: aria-something // NOTE: about's testid must = 'about-page-backdrop'
    <Backdrop className={classes.root} open data-testid={testID}>
      <div className={classes.backdropContent}>
        <div>
          <Typography variant="h4" component="h2" className={classes.text}>
            {text}
          </Typography>
          <CircularProgress color="inherit" size={43} />
        </div>
      </div>
    </Backdrop>
  )
}
