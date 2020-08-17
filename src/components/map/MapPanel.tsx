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
    paperRoot: {
      position: 'absolute',
      backgroundColor: 'hsla(100, 0%, 100%, 0.95)',
      width: '100%',
      top: 0,
      transition: '300ms all',
      opacity: (props: PaperRoot) => (props.active ? 1 : 0),
      zIndex: (props: PaperRoot) => (props.active ? 1 : -1),
      display: 'flex',
      flexDirection: 'column',
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
    <Paper className={classes.paperRoot}>
      <MapPanelHeader
        active={active}
        heading={heading}
        icon={icon}
        subheading={subheading}
      />
      <Box
        paddingY={1}
        paddingX={2}
        overflow="auto"
        zIndex={1}
        position="relative"
      >
        {component}
      </Box>
    </Paper>
  )
}
