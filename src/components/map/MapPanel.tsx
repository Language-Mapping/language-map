import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { Box, Typography, Paper } from '@material-ui/core'

type PanelPositionTypes = 'open' | 'half' | 'closed'

type MapPanelTypes = {
  heading: string
  position: PanelPositionTypes
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapPanelRoot: {
      left: theme.spacing(1),
      right: theme.spacing(1),
      position: 'absolute',
      bottom: 60,
      height: 200,
      backgroundColor: fade(theme.palette.common.white, 0.85),
      [theme.breakpoints.up('sm')]: {
        width: 325,
        top: 140,
        bottom: theme.spacing(4),
        left: 16,
      },
      '& .MuiPaper-root': {
        height: '100%',
      },
    },
  })
)

export const MapPanel: FC<MapPanelTypes> = ({
  children,
  heading,
  position,
}) => {
  const classes = useStyles()
  // TODO: rm if not using
  // const heights = {
  //   open: 200,
  //   half: 200,
  //   closed: 200,
  // }
  const transforms = {
    open: 'translateY(0%)',
    half: 'translateY(50%)',
    closed: 'translateY(100%)',
  }

  return (
    <Box
      className={classes.mapPanelRoot}
      style={{ transform: transforms[position], transition: '300ms transform' }}
    >
      <Paper>
        <Box padding={2}>
          <Typography variant="h4">{heading}</Typography>
          {children}
        </Box>
      </Paper>
    </Box>
  )
}
