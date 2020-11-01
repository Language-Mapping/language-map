import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import Breadcrumbs from '../sift/Breadcrumbs'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
      // outline: 'solid red 1px',
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      '& > svg': {
        marginRight: 4,
        fontSize: '0.65em',
        fill: theme.palette.text.secondary,
      },
    },
    header: {
      // outline: 'solid green 1px',
      margin: '1em 0',
    },
    intro: { fontSize: '0.7em', color: theme.palette.text.secondary },
    body: {
      padding: '0.25em 0',
    },
  })
)

// TODO: consider swipeable views for moving between panels:
// https://react-swipeable-views.com/demos/demos/
// TODO: git mv into Panels.tsx
export const PanelContent: FC<Types.PanelContentProps> = (props) => {
  const { children, title, intro, icon } = props
  const classes = useStyles()

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <>
      <Breadcrumbs />
      <div className={classes.root}>
        <header className={classes.header}>
          <Typography variant="h3" className={classes.title}>
            {icon}
            {title}
          </Typography>
          <Typography className={classes.intro}>{intro}</Typography>
        </header>
        <div className={classes.body}>{children}</div>
      </div>
    </>
  )
}
