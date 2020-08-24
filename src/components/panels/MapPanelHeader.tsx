import React, { FC } from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import {
  MOBILE_PANEL_HEADER_HEIGHT,
  DESKTOP_PANEL_HEADER_HEIGHT,
} from 'components/map/styles'
import { MapPanel } from 'components/panels/types'

type PanelHeaderProps = {
  active?: boolean
}

type PanelHeaderComponent = Omit<MapPanel, 'component'> & {
  active: boolean
  panelOpen: boolean
  setPanelOpen: React.Dispatch<boolean>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelHeaderRoot: {
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      borderBottom: `solid 2px ${theme.palette.primary.dark}`,
      color: theme.palette.common.white,
      display: 'flex',
      flexShrink: 0,
      height: DESKTOP_PANEL_HEADER_HEIGHT,
      justifyContent: 'center',
      position: 'sticky',
      textAlign: 'center',
      top: 0,
      zIndex: 1,
      '& a, a:visited': {
        color: `${theme.palette.common.white} !important`, // constant fight!
      },
      [theme.breakpoints.down('xs')]: {
        height: MOBILE_PANEL_HEADER_HEIGHT,
      },
    },
    mainHeading: {
      alignItems: 'center',
      alignContent: 'center',
      display: 'grid',
      flex: 1,
      fontSize: '1.75rem',
      height: '100%',
      justifyContent: 'center',
      padding: `0 ${theme.spacing(1)}px`,
      gridTemplateAreas: `
        "icon main"
        "subheading subheading"
      `,
      transition: '300ms background-color',
      backgroundColor: (props: PanelHeaderProps) =>
        props.active ? theme.palette.primary.dark : theme.palette.primary.light,
      '& .panel-header-text': {
        gridArea: 'main',
      },
      '& svg': {
        gridArea: 'icon',
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
  })
)

export const MapPanelHeaderChild: FC<PanelHeaderComponent> = (props) => {
  const {
    active,
    heading,
    icon,
    panelOpen,
    path,
    setPanelOpen,
    subheading,
  } = props
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
          if (active && panelOpen) {
            setPanelOpen(false)
          } else {
            setPanelOpen(true)
          }
        }}
      >
        {icon}
        <span className="panel-header-text">{heading}</span>
      </Typography>
    </>
  )
}

export const MapPanelHeader: FC = (props) => {
  const { children } = props
  const classes = useStyles({})

  return (
    <Box component="header" className={classes.panelHeaderRoot}>
      {children}
    </Box>
  )
}
