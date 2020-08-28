import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Paper } from '@material-ui/core'

import {
  DESKTOP_PANEL_HEADER_HEIGHT,
  MOBILE_PANEL_HEADER_HEIGHT,
  panelWidths,
} from 'components/map/styles'

type MapPanelProps = {
  active?: boolean
  panelOpen?: boolean
  screenHeight?: number
}

type PanelContentComponent = Partial<MapPanelProps> & {
  heading: string
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPanelsWrap: {
      bottom: 0,
      left: theme.spacing(1),
      position: 'absolute',
      right: theme.spacing(1),
      transition: '300ms transform',
      '& .MuiPaper-root': {
        height: '100%',
        overflowY: 'auto',
      },
      transform: (props: MapPanelProps) => {
        if (!props.panelOpen) {
          return `translateY(calc(100% - ${MOBILE_PANEL_HEADER_HEIGHT}))`
        }

        return 'translateY(0)'
      },
      [theme.breakpoints.up('md')]: {
        bottom: theme.spacing(3),
        left: theme.spacing(3),
        top: `${theme.spacing(3)}px !important`, // INSANITY
        width: panelWidths.mid,
        transform: (props: MapPanelProps) => {
          if (!props.panelOpen) {
            return `translateY(calc(100% - ${DESKTOP_PANEL_HEADER_HEIGHT}))`
          }

          return 'translateY(0)'
        },
      },
      top: (props: MapPanelProps) =>
        props.screenHeight ? `${props.screenHeight / 2}px` : 'auto',
      [theme.breakpoints.up('lg')]: {
        width: panelWidths.midLarge,
      },
    },
    panelRoot: {
      display: 'flex',
      flexDirection: 'column',
      // YES. We really have to go this high up. Tests fail with errors like:
      // Material-UI: The key `omniboxLabel` provided to the classes prop is not
      // implemented in ForwardRef(Autocomplete).
      '& .MuiInputLabel-formControl': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
      },
    },
    panelContent: {
      overflow: 'auto',
      padding: '.8rem',
      position: 'relative',
      // transition: '300ms max-height', // TODO: restore or remove
      opacity: (props: MapPanelProps) =>
        props.active && props.panelOpen ? 1 : 0,
      transform: (props: MapPanelProps) =>
        props.active && props.panelOpen ? 'scaleY(1)' : 'scaleY(0)',
      // TODO: restore or remove
      // maxHeight: (props: PanelProps) =>
      //   props.active && props.panelOpen ? '100%' : 0,
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
  })
)

// TODO: no need for separate component if render props are used on parent
export const MapPanelContent: FC<PanelContentComponent> = (props) => {
  const { active, children, panelOpen } = props
  const classes = useStyles({ active, panelOpen })

  return <Box className={classes.panelContent}>{children}</Box>
}

export const MapPanel: FC<MapPanelProps> = (props) => {
  const { children, screenHeight, panelOpen } = props
  const classes = useStyles({ screenHeight, panelOpen })

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <Box id="map-panels-wrap" className={classes.mapPanelsWrap}>
      <Paper className={classes.panelRoot} elevation={14}>
        {children}
      </Paper>
    </Box>
  )
}
