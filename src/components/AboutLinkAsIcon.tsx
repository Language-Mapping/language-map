import React, { FC } from 'react'
import {
  Link as RouteLink,
  LinkProps as RouteLinkProps,
} from 'react-router-dom'
import { Omit } from '@material-ui/types'
import { IconButton } from '@material-ui/core'
import { GoInfo } from 'react-icons/go'

interface ListItemLinkProps {
  muiClass: string
  to?: string
}

export const AboutLinkAsIcon: FC<ListItemLinkProps> = ({
  muiClass,
  to = '/about',
}) => {
  const renderLink = React.useMemo(
    () =>
      // TODO: fix this mess:
      // https://github.com/yannickcr/eslint-plugin-react/issues/2269
      // eslint-disable-next-line
      React.forwardRef<any, Omit<RouteLinkProps, 'to'>>((itemProps, ref) => (
        <RouteLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  )

  return (
    <IconButton
      color="inherit"
      className={muiClass}
      component={renderLink}
      edge="end"
    >
      <GoInfo />
    </IconButton>
  )
}
