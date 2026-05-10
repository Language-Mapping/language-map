import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { CircularProgress, Typography } from '@mui/material'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      bottom: 0,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'absolute',
      textAlign: 'center',
      top: 0,
      width: '100%',
      zIndex: theme.zIndex.drawer + 2, // above <Background>
    },
    text: {
      textShadow: '1px 1px 5px #444',
      marginBottom: theme.spacing(1),
    },
  })
)

export const LoadingTextOnElem: FC<{ text?: string }> = (props) => {
  const { text = 'Loading...' } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="h2" className={classes.text}>
        {text}
      </Typography>
      <CircularProgress color="inherit" size={43} />
    </div>
  )
}
