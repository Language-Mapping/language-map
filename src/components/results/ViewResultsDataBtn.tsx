import React, { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'

import { paths as routes } from 'components/config/routes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    viewResultsBtnRoot: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
  })
)

export const ViewResultsDataBtn: FC = () => {
  const loc = useLocation()
  const classes = useStyles()

  return (
    <Button
      color="primary"
      component={RouterLink}
      size="small"
      startIcon={<TiThList />}
      to={`${routes.table}${loc.search}`}
      variant="contained"
      className={classes.viewResultsBtnRoot}
    >
      Data and filters
    </Button>
  )
}
