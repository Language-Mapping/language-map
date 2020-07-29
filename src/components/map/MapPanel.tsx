import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography, Paper, Divider } from '@material-ui/core'

import { MapPanelTypes } from './types'

type PaperRootType = {
  active: boolean
}

// Uses component props (e.g. `active`) w/o access to Theme
const useStyles = makeStyles({
  paperRoot: {
    position: 'absolute',
    backgroundColor: 'hsla(100, 0%, 100%, 0.95)',
    width: '100%',
    top: 0,
    transition: '300ms all',
    opacity: (props: PaperRootType) => (props.active ? 1 : 0),
    zIndex: (props: PaperRootType) => (props.active ? 1 : -1),
    display: 'flex',
    flexDirection: 'column',
  },
})

const useThemeStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      borderBottom: `solid 8px ${theme.palette.primary.dark}`,
      padding: `6px ${theme.spacing(2)}px`,
      top: 0,
      flexShrink: 0,
      position: 'sticky',
      display: 'flex',
      alignItems: 'center',
    },
    mainHeading: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(1),
      '& svg': {
        marginRight: theme.spacing(1),
        height: '0.8em',
        width: '0.8em',
      },
    },
    summary: {
      fontSize: 12,
      color: theme.palette.grey[800],
      marginTop: 0,
    },
  })
)

export const MapPanel: FC<MapPanelTypes> = ({
  active,
  component,
  heading,
  icon,
  subheading,
  summary,
}) => {
  const classes = useStyles({ active })
  const themeClasses = useThemeStyles()

  return (
    <Paper className={classes.paperRoot}>
      <Box component="header" className={themeClasses.intro}>
        <Typography variant="h4" className={themeClasses.mainHeading}>
          {icon}
          {heading}
        </Typography>
        <Typography variant="caption">{subheading}</Typography>
      </Box>
      <Box
        paddingY={1}
        paddingX={2}
        overflow="auto"
        zIndex={1}
        position="relative"
      >
        {summary ? (
          <>
            <p className={themeClasses.summary}>{summary}</p>
            <Divider />
          </>
        ) : null}
        {component}
      </Box>
    </Paper>
  )
}
