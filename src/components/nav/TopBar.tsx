import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { routes } from 'components/config/api'
import { usePanelState } from 'components/panels'
import { useMapToolsState } from 'components/context'
import { Logo } from 'components/generic'
import { PAGE_HEADER_ID } from './config'
import { useStyles } from './styles'

export const TopBar: FC = () => {
  const { panelOpen } = usePanelState()
  const { baseLayer } = useMapToolsState()
  const classes = useStyles({ panelOpen })
  const { spacerDesktop, spacerLeft, title, root } = classes

  return (
    <header className={root} id={PAGE_HEADER_ID}>
      <div className={`${spacerDesktop} ${spacerLeft}`} />
      <Typography variant="h2" component="h1" className={title}>
        <RouteLink to={routes.home} data-testid={PAGE_HEADER_ID}>
          <Logo darkTheme={baseLayer !== 'light'} />
        </RouteLink>
      </Typography>
      <div className={spacerDesktop} />
    </header>
  )
}
