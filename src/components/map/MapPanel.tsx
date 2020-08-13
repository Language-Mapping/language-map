import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography, Paper } from '@material-ui/core'

import { MapPanel as MapPanelType } from './types'

type PaperRoot = {
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
    intro: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      borderBottom: `solid 8px ${theme.palette.primary.dark}`,
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
    summary: {
      fontSize: 12,
      color: theme.palette.grey[700],
      marginTop: 0,
      marginBottom: theme.spacing(1),
    },
  })
)

export const MapPanel: FC<MapPanelType> = ({
  active,
  component,
  heading,
  icon,
  subheading,
  summary,
}) => {
  const classes = useStyles({ active })

  return (
    <Paper className={classes.paperRoot}>
      <Box component="header" className={classes.intro}>
        <Typography variant="h4" className={classes.mainHeading}>
          {icon}
          {heading}
          <Typography variant="caption" className={classes.subheading}>
            {subheading}
          </Typography>
        </Typography>
      </Box>
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
