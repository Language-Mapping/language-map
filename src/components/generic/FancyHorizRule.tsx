import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'

import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      color: theme.palette.divider,
      display: 'grid',
      gridTemplateColumns: '1fr 1.25rem 1fr',
      justifyContent: 'center',
    },
    // CRED: (ish) https://css-tricks.com/examples/hrs/
    line: {
      borderTop: 'solid 1px',
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
