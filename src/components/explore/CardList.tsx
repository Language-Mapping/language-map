import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // TODO: masonry someday:
    // www.smashingmagazine.com/2017/09/css-grid-gotchas-stumbling-blocks/
    root: {
      display: 'grid',
      gridRowGap: '0.75em',
      gridColumnGap: '0.5em',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      margin: '1rem 0',
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
