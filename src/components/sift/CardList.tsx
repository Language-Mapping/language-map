import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridRowGap: '0.65em',
      gridColumnGap: '0.5em',
    },
  })
)

// TODO: https://react-window.now.sh/#/examples/list/fixed-size
// Simple grid wrapper designed for Card children
export const CardList: FC = (props) => {
  const { children } = props
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}
