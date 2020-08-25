import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Paper } from '@material-ui/core'

type PanelProps = {
  active?: boolean
  panelOpen?: boolean
}

type PanelContentComponent = {
  active: boolean
  heading: string
  panelOpen: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelRoot: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    panelContent: {
      overflow: 'auto',
      padding: '.8rem',
      position: 'relative',
      // transition: '300ms all',
      opacity: (props: PanelProps) => (props.active && props.panelOpen ? 1 : 0),
      transform: (props: PanelProps) =>
        props.active && props.panelOpen ? 'scaleY(1)' : 'scaleY(0)',
      maxHeight: (props: PanelProps) =>
        props.active && props.panelOpen ? '100%' : 0,
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
      },
    },
  })
)

export const MapPanelContent: FC<PanelContentComponent> = (props) => {
  const { active, children, panelOpen } = props
  const classes = useStyles({ active, panelOpen })

  return <Box className={classes.panelContent}>{children}</Box>
}

export const MapPanel: FC = (props) => {
  const { children } = props
  const classes = useStyles({})

  return (
    <Paper className={classes.panelRoot} elevation={14}>
      {children}
    </Paper>
  )
}
