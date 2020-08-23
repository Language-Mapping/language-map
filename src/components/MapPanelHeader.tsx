import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import {
  MOBILE_PANEL_HEADER_HEIGHT,
  DESKTOP_PANEL_HEADER_HEIGHT,
} from 'components/map/styles'
import { MapPanel } from './map/types'

type PanelHeaderProps = {
  active?: boolean
}

type PanelHeaderComponent = Omit<MapPanel, 'component' | 'path'> & {
  active: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelHeaderRoot: {
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      borderBottom: `solid 4px ${theme.palette.primary.dark}`,
      color: theme.palette.common.white,
      display: 'flex',
      flexShrink: 0,
      height: DESKTOP_PANEL_HEADER_HEIGHT,
      justifyContent: 'center',
      position: 'sticky',
      textAlign: 'center',
      top: 0,
      [theme.breakpoints.down('xs')]: {
        height: MOBILE_PANEL_HEADER_HEIGHT,
      },
    },
    mainHeading: {
      alignItems: 'center',
      alignContent: 'center',
      display: 'grid',
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      padding: `0 ${theme.spacing(1)}px`,
      gridTemplateAreas: `
        "icon main"
        "subheading subheading"
      `,
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
    },
  })
)

export const MapPanelHeaderChild: FC<PanelHeaderComponent> = ({
  active,
  heading,
  icon,
  subheading,
}) => {
  const classes = useStyles({ active })

  return (
    <>
      <Typography
        variant="h4"
        component="h2"
        className={classes.mainHeading}
        title={`${heading} ${subheading}`}
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
