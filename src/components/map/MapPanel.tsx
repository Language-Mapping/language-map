import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography, Paper, Divider } from '@material-ui/core'

type MapPanelTypes = {
  heading: string
  subheading: string
  active: boolean
  icon: React.ReactNode
  component?: React.ReactNode
}

type PaperRootType = {
  active: boolean
}

const useStyles = makeStyles({
  paperRoot: {
    position: 'absolute',
    backgroundColor: 'hsla(100, 0%, 100%, 0.95)',
    width: '100%',
    top: 0,
    transition: '300ms all',
    opacity: (props: PaperRootType) => (props.active ? 1 : 0),
    zIndex: (props: PaperRootType) => (props.active ? 1 : -1),
  },
})

const useThemeStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainHeading: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: theme.spacing(1),
        height: '0.8em',
        width: '0.8em',
      },
    },
  })
)

export const MapPanel: FC<MapPanelTypes> = ({
  component,
  heading,
  subheading,
  active,
  icon,
}) => {
  const classes = useStyles({ active })
  const themeClasses = useThemeStyles()

  return (
    <Paper className={classes.paperRoot}>
      <Box padding={2}>
        <Box component="header" paddingBottom={1}>
          <Typography variant="h4" className={themeClasses.mainHeading}>
            {icon}
            {heading}
          </Typography>
          <Typography>{subheading}</Typography>
        </Box>
        <Divider />
        {component}
        <Divider />
        <p>
          <small>Complex panels could be organized by Tabs.</small>
        </p>
      </Box>
    </Paper>
  )
}
