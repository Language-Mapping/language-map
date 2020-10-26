import React, { FC, useContext } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import { MOBILE_PANEL_HEADER_HT } from 'components/panels/config'
import { MapPanel } from 'components/panels/types'
import { GlobalContext } from 'components'
import { PanelCloseBtn } from './PanelCloseBtn'

type PanelHeaderComponent = Omit<MapPanel, 'component'>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelHeaderRoot: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      display: 'flex',
      // justifyContent: 'center',
      '& a, a:visited': {
        color: 'inherit',
      },
      /* left top */
      /* right top */
      /* right bottom */
      /* left bottom */
      // CRED: https://kilianvalkhof.com/2017/design/sloped-edges-with-consistent-angle-in-css/
      '& > *': {
        clipPath: `polygon(
          0 0,
          100% 0,
          100% 90%,
          0 100%
        )`,
      },
      '& > :first-child': {
        color: 'green',
        clipPath: `polygon(
          0 0,
          100% 0,
          100% 90%,
          0 100%
        )`,
      },
      '& > :last-child': {
        clipPath: `polygon(
          5% 0,
          100% 0,
          100% 100%,
          0 100%
        )`,
      },
      '& :hover': {
        backgroundColor: theme.palette.primary.dark,
      },
      // '& a, a:visited': {
      //   color: `${theme.palette.common.white} !important`, // constant fight!
      // },
      [theme.breakpoints.down('sm')]: { height: MOBILE_PANEL_HEADER_HT },
    },
    panelNavItem: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      fontSize: '1.5rem',
      height: '100%',
      padding: `${theme.spacing(1)}px 0.75rem`,
      transition: '300ms background-color',
      outline: 'solid gold 1px',
      color: theme.palette.text.secondary,
      backgroundColor: 'black',
      '& svg': { marginRight: 6, height: '0.8em', width: '0.8em' },
      [theme.breakpoints.up('lg')]: {
        fontSize: '1.85rem',
        padding: `${theme.spacing(1)}px 1rem`,
      },
    },
    panelNavItemActive: {
      // backgroundColor: 'teal',
      // fontWeight: 'bold',
      color: theme.palette.text.primary,
      // '& a, a:visited': { },
      // '&:hover': {
      //   backgroundColor: 'tan',
      // },
    },
  })
)

export const MapPanelHeaderChild: FC<PanelHeaderComponent> = (props) => {
  const { heading, icon, rootPath, subheading } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles()
  const { panelNavItem, panelNavItemActive } = classes
  const loc = useLocation()

  return (
    <>
      <Typography
        variant="h4"
        component={NavLink}
        className={panelNavItem}
        activeClassName={panelNavItemActive}
        title={`${heading} ${subheading} (click to show/hide panel)`}
        // TODO: preserve states like selFeatID, etc. on route change (already
        // have a Type def started)
        to={{
          // pathname: `${rootPath}${subPath}`,
          pathname: rootPath,
          state: loc.state,
        }}
        onClick={() => {
          // Open the panel
          if (state.panelState === 'minimized') {
            dispatch({ type: 'SET_PANEL_STATE', payload: 'default' })
          }
        }}
      >
        {icon}
        {heading}
      </Typography>
    </>
  )
}

export const MapPanelHeader: FC = (props) => {
  const { children } = props
  const classes = useStyles({})

  return (
    <Box component="header" className={classes.panelHeaderRoot}>
      <PanelCloseBtn />
      {children}
    </Box>
  )
}
