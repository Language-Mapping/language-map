import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      color: theme.palette.action.disabled,
      display: 'grid',
      gridTemplateColumns: '1fr 1.25rem 1fr',
      justifyContent: 'center',
    },
    // CRED: (ish) https://css-tricks.com/examples/hrs/
    line: {
      borderTop: 'double medium',
      height: 1,
    },
    symbol: {
      fontSize: '1.25rem',
      padding: '0 0.25rem',
    },
  })
)

export const FancyHorizRule: FC = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.line} />
      <span className={classes.symbol}>§</span>
      <div className={classes.line} />
    </div>
  )
}
