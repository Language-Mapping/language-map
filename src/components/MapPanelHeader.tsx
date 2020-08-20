import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import { MapPanel } from './map/types'

type PaperRoot = {
  active: boolean
}

type MapPanelComponent = Omit<MapPanel, 'component' | 'path'> & {
  active: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelHeaderRoot: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      borderBottom: `solid 6px ${theme.palette.primary.dark}`,
      padding: `6px ${theme.spacing(1)}px`,
      top: 0,
      flexShrink: 0,
      position: 'sticky',
      display: 'flex',
      alignItems: 'center',
    },
    mainHeading: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: 6,
        height: '0.8em',
        width: '0.8em',
      },
    },
    subheading: {
      marginLeft: 6,
    },
  })
)

export const MapPanelHeader: FC<MapPanelComponent> = ({
  active,
  heading,
  icon,
  subheading,
}) => {
  const classes = useStyles({ active })

  return (
    <Box component="header" className={classes.panelHeaderRoot}>
      <Typography variant="h4" className={classes.mainHeading}>
        {icon}
        {heading}
        <Typography variant="caption" className={classes.subheading}>
          {subheading}
        </Typography>
      </Typography>
    </Box>
  )
}
