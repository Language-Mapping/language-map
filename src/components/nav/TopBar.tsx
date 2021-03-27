import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { routes } from 'components/config/api'
import { usePanelState } from 'components/panels'
import { ReactComponent as Logo } from '../../img/logo.svg'
import { PAGE_HEADER_ID } from './config'
import { useStyles } from './styles'

export const TopBar: FC = () => {
  const { panelOpen } = usePanelState()
  const classes = useStyles({ panelOpen })
  const { spacerDesktop, spacerLeft, title, topBarRoot, logo } = classes

  // TODO: account for panel being open on desktop. If it isn't, slide left.
  return (
    // Need the `id` in order to find unique element for `map.setPadding`
    <header className={topBarRoot} id={PAGE_HEADER_ID}>
      <div className={`${spacerDesktop} ${spacerLeft}`} />
      <Typography variant="h2" component="h1" className={title}>
        <RouteLink to={routes.home} data-testid={PAGE_HEADER_ID}>
          <Logo className={logo} />
        </RouteLink>
      </Typography>
      <div className={spacerDesktop} />
    </header>
  )
}
