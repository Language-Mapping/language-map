import React, { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'
import { RouteLocation } from 'components/map/types'

const DATA_TABLE_PATHNAME: RouteLocation = '/table'

export const ViewResultsDataBtn: FC = () => {
  const loc = useLocation()

  return (
    <Button
      color="primary"
      component={RouterLink}
      size="small"
      startIcon={<TiThList />}
      to={`${DATA_TABLE_PATHNAME}${loc.search}`}
      variant="outlined"
    >
      View data and filters
    </Button>
  )
}
