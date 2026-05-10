import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { GoInfo } from 'react-icons/go'

type ListItemLinkProps = {
  muiClass: string
  to?: string
}

export const AboutLinkAsIcon: FC<ListItemLinkProps> = ({
  muiClass,
  to = '/Info/About',
}) => {
  const navigate = useNavigate()

  return (
    <IconButton
      title="Project info"
      color="inherit"
      className={muiClass}
      edge="end"
      onClick={() => navigate(to)}
      size="large"
    >
      <GoInfo />
    </IconButton>
  )
}
