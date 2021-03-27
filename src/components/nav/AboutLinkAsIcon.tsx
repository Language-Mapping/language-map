import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { IconButton } from '@material-ui/core'
import { GoInfo } from 'react-icons/go'

type ListItemLinkProps = {
  muiClass: string
  to?: string
}

export const AboutLinkAsIcon: FC<ListItemLinkProps> = ({
  muiClass,
  to = '/Info/About',
}) => {
  const history = useHistory()

  return (
    <IconButton
      title="Project info"
      color="inherit"
      className={muiClass}
      edge="end"
      onClick={() => history.push(to)}
    >
      <GoInfo />
    </IconButton>
  )
}
