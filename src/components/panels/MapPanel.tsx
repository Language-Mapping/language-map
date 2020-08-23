import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Box, Paper } from '@material-ui/core'

type PanelProps = {
  active?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panelRoot: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      transition: '300ms all',
      width: '100%',
    },
    panelContent: {
      overflow: 'auto',
      padding: '.8rem',
      // TODO: make it nicely transitioned again
      opacity: (props: PanelProps) => (props.active ? 1 : 0),
      position: 'relative',
      transition: '300ms opacity',
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
    },
  })
)

export const MapPanelContent: FC<{ active: boolean; heading: string }> = (
  props
) => {
  const { active, children } = props
  const classes = useStyles({ active })

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
