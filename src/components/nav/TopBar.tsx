import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Link as RouteLink } from 'react-router-dom'

import { routes } from 'components/config/api'
import { usePanelState } from 'components/panels'
import { useMapToolsState } from 'components/context'
import { Logo } from 'components/generic'
import { PAGE_HEADER_ID } from './config'

// CRED: for horiz. centering
// css-tricks.com/forums/topic/horizontal-centering-of-an-absolute-element/
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '1rem',
      left: '50%',
      position: 'absolute',
      top: '0.75rem',
      transform: 'translateX(-50%)',
      zIndex: 1,
      [theme.breakpoints.only('md')]: {
        top: '0.25rem',
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
)

export const TopBar: FC = () => {
  const { panelOpen } = usePanelState()
  const { baseLayer } = useMapToolsState()
  const classes = useStyles({ panelOpen })

  return (
    <h1 className={classes.root} id={PAGE_HEADER_ID}>
      <RouteLink to={routes.home} data-testid={PAGE_HEADER_ID}>
        <Logo darkTheme={baseLayer !== 'light'} />
      </RouteLink>
    </h1>
  )
}
