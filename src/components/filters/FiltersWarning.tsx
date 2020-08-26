import React, { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Link, Typography } from '@material-ui/core'
import { TiWarning } from 'react-icons/ti'

import { RouteLocation } from 'components/map/types'

const detailsRoutePath: RouteLocation = '/details'

const useStyles = makeStyles(() =>
  createStyles({
    filtersWarning: {
      display: 'flex', // TODO: probably not flex, only need for icon vert align
      alignItems: 'center',
      fontSize: '.8rem',
      '& > a': {
        fontWeight: 'bold',
      },
      '& > svg': {
        marginRight: '0.4em',
      },
    },
  })
)

// Let user know that they are searching filtered data
export const FiltersWarning: FC = () => {
  const loc = useLocation()
  const classes = useStyles()
  const tableRoute = `${detailsRoutePath}${loc.search}`

  return (
    <Typography className={classes.filtersWarning}>
      <TiWarning />
      Data search includes current filters.&nbsp;
      <Link component={RouterLink} to={tableRoute}>
        View in data table
      </Link>
    </Typography>
  )
}
