import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Paper, Divider } from '@material-ui/core'

type MapPanelTypes = {
  heading: string
  subheading: string
  active: boolean
  component?: React.ReactNode
}

type PaperRootType = {
  active: boolean
}

const useStyles = makeStyles({
  paperRoot: {
    position: 'absolute',
    top: 0,
    transition: '300ms all',
    opacity: (props: PaperRootType) => (props.active ? 1 : 0),
    zIndex: (props: PaperRootType) => (props.active ? 1 : -1),
  },
})

export const MapPanel: FC<MapPanelTypes> = (props) => {
  const { component, heading, subheading, active } = props

  const classes = useStyles({ active })

  return (
    <Paper className={classes.paperRoot}>
      <Box padding={2}>
        <Typography variant="h4">{heading}</Typography>
        <Typography variant="h6">{subheading}</Typography>
        {component}
        <Divider />
        <small>
          If relevant, especially for complex panels with tons of info, the
          elements could be organized by mutually exclusive Tabs.
        </small>
      </Box>
    </Paper>
  )
}
