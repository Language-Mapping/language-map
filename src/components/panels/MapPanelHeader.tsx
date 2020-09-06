import React, { FC, useContext } from 'react'
import { useLocation, Link as RouterLink, useHistory } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography, IconButton } from '@material-ui/core'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillQuestionCircle } from 'react-icons/ai'

import { DESKTOP_PANEL_HEADER_HEIGHT } from 'components/map/styles'
import { MapPanel } from 'components/panels/types'
import { GlobalContext } from 'components'

type PanelHeaderProps = {
  active?: boolean
}

type PanelHeaderComponent = Omit<MapPanel, 'component'> & {
  active: boolean
}

const useCloseBtnStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelCloseBtn: {
      transition: '300ms transform',
      transformOrigin: 'center center',
      transform: (props: { panelOpen: boolean }) =>
        props.panelOpen ? 'rotate(0deg)' : 'rotate(180deg)',
    },
  })
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // The wrapper
    panelHeaderRoot: {
      alignItems: 'center',
      color: theme.palette.common.white,
      display: 'flex',
      flexShrink: 0,
      height: DESKTOP_PANEL_HEADER_HEIGHT,
      justifyContent: 'center',
      position: 'sticky',
      bottom: 0,
      textAlign: 'center',
      top: 0,
      width: '100%',
      zIndex: 1,
      '& a, a:visited': {
        color: `${theme.palette.common.white} !important`, // constant fight!
      },
      [theme.breakpoints.down('xs')]: { height: '3rem' },
    },
    mainHeading: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      fontSize: '1.5rem',
      height: '100%',
      padding: `${theme.spacing(1)}px 0.75rem`,
      transition: '300ms background-color',
      [theme.breakpoints.up('lg')]: {
        fontSize: '1.85rem',
        padding: `${theme.spacing(1)}px 1rem`,
      },
      backgroundColor: (props: PanelHeaderProps) =>
        props.active ? theme.palette.primary.dark : theme.palette.primary.light,
      '& svg': {
        marginRight: 6,
        height: '0.8em',
        width: '0.8em',
      },
      '&:hover': {
        backgroundColor: (props: PanelHeaderProps) => {
          const { dark, main } = theme.palette.primary

          return props.active ? dark : main
        },
      },
    },
    headerBtns: {
      position: 'absolute',
      right: '0.25rem',
      [theme.breakpoints.up('sm')]: {
        right: '.75rem',
      },
    },
  })
)

const PanelCloseBtn: FC = (props) => {
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useCloseBtnStyles({
    panelOpen: state.panelState === 'default',
  })

  return (
    <IconButton
      size="small"
      className={classes.panelCloseBtn}
      onClick={() => {
        const nextPanelState =
          state.panelState === 'default' ? 'minimized' : 'default'

        dispatch({ type: 'SET_PANEL_STATE', payload: nextPanelState })
      }}
    >
      <MdKeyboardArrowDown />
    </IconButton>
  )
}

const OpenGlossaryBtn: FC = (props) => {
  const loc = useLocation()
  const history = useHistory()

  return (
    <IconButton
      size="small"
      onClick={() => {
        history.push(`/glossary${loc.search}`)
      }}
    >
      <AiFillQuestionCircle />
    </IconButton>
  )
}

export const MapPanelHeaderChild: FC<PanelHeaderComponent> = (props) => {
  const { active, heading, icon, path, subheading } = props
  const { state, dispatch } = useContext(GlobalContext)
  const classes = useStyles({ active })
  const loc = useLocation()

  return (
    <>
      <Typography
        variant="h4"
        // component="h2" // TODO: make semantic if it makes sense
        component={RouterLink}
        className={classes.mainHeading}
        title={`${heading} ${subheading} (click to show/hide panel)`}
        to={`${path}${loc.search}`}
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
      <div className={classes.headerBtns}>
        <PanelCloseBtn />
        <OpenGlossaryBtn />
      </div>
      {children}
    </Box>
  )
}
