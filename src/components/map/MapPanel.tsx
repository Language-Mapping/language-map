import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Paper } from '@material-ui/core'

import { MapPanelHeader } from 'components'
import { MapPanel as MapPanelType } from './types'

type PaperRoot = {
  active: boolean
}

type MapPanelComponent = MapPanelType & {
  active: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPanelRoot: {
      backgroundColor: 'hsla(100, 0%, 100%, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      opacity: (props: PaperRoot) => (props.active ? 1 : 0),
      position: 'absolute',
      top: 0,
      transition: '300ms all',
      width: '100%',
      zIndex: (props: PaperRoot) => (props.active ? 1 : -1),
    },
    mapPanelContent: {
      overflow: 'auto',
      padding: 10,
      position: 'relative',
      zIndex: 1,
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
    },
  })
)

export const MapPanel: FC<MapPanelComponent> = ({
  active,
  component,
  heading,
  icon,
  subheading,
}) => {
  const classes = useStyles({ active })

  return (
    <Paper className={classes.mapPanelRoot} elevation={14}>
      <MapPanelHeader
        active={active}
        heading={heading}
        icon={icon}
        subheading={subheading}
      />
      <Box className={classes.mapPanelContent}>{component}</Box>
    </Paper>
  )
}
