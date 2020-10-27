import React, { FC, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link, Badge } from '@material-ui/core'

import { GlobalContext } from 'components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filtersWarning: {
      fontSize: '0.7em',
      marginLeft: 6,
      lineHeight: 0.8,
      color: theme.palette.text.secondary,
    },
    fabBadge: {
      backgroundColor: theme.palette.warning.light,
    },
  })
)

// Let user know that they are searching filtered data
export const FiltersWarning: FC = () => {
  const classes = useStyles()
  const { dispatch } = useContext(GlobalContext)

  return (
    <Badge
      variant="dot"
      color="secondary"
      classes={{ dot: classes.fabBadge }}
      style={{ marginLeft: 8 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Typography className={classes.filtersWarning} component="span">
        Filters in the Data Table will affect results.{' '}
        <Link
          title="Clear table filters"
          href="#"
          color="primary"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()

            // TODO: fix, obviously:
            dispatch({ type: 'CLEAR_FILTERS', payload: 555 })
          }}
        >
          Clear filters
        </Link>
      </Typography>
    </Badge>
  )
}
