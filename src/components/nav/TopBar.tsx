import React, { FC, useContext } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Typography } from '@material-ui/core'

import { paths as routes } from 'components/config/routes'
import { GlobalContext } from 'components'
import { ReactComponent as Logo } from '../../img/logo.svg'
import { PAGE_HEADER_ID } from './config'
import { useStyles } from './styles'

export const TopBar: FC = () => {
  const { state } = useContext(GlobalContext)
  const classes = useStyles({ panelOpen: state.panelState === 'default' })
  const { spacerDesktop, spacerLeft, title, topBarRoot, logo } = classes

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <header className={topBarRoot} id={PAGE_HEADER_ID}>
      <div className={`${spacerDesktop} ${spacerLeft}`} />
      <Typography variant="h2" component="h1" className={title}>
        <RouteLink to={routes.home}>
          <Logo className={logo} />
        </RouteLink>
      </Typography>
      <div className={spacerDesktop} />
    </header>
  )
}
