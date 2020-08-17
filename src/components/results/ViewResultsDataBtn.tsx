import React, { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { TiThList } from 'react-icons/ti'
import { RouteLocation } from 'components/map/types'

const DATA_TABLE_PATH: RouteLocation = '/table'

export const ViewResultsDataBtn: FC = () => {
  const loc = useLocation()

  return (
    <Button
      to={`${DATA_TABLE_PATH}${loc.search}`}
      color="primary"
      size="small"
      variant="contained"
      component={RouterLink}
      startIcon={<TiThList />}
    >
      View data
    </Button>
  )
}
