import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { IoIosCloseCircleOutline } from 'react-icons/io'

import { routes } from 'components/config/api'

type ClearSelectionBtnProps = {
  targetRoute?: string
  title?: string
}

export const ClearSelectionBtn: FC<ClearSelectionBtnProps> = (props) => {
  const {
    targetRoute = routes.neighborhood,
    title = 'Show all neighborhoods',
  } = props

  return (
    <Button
      size="small"
      color="secondary"
      title={title}
      component={RouterLink}
      to={targetRoute}
      startIcon={<IoIosCloseCircleOutline />}
    >
      De-select
    </Button>
  )
}
