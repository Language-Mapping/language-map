import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { FiltersWarning } from 'components/filters/FiltersWarning'
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
      fontSize: '2em',
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.4em',
      },
      '& > svg': {
        marginRight: '0.25em',
        fontSize: '0.75em',
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

  const Title = (
    <Typography component="h2" variant="h4" className={classes.title}>
      {icon}
      {title}
    </Typography>
  )

  // Need the `id` in order to find unique element for `map.setPadding`
  return (
    <>
      <Breadcrumbs />
      <div className={classes.root}>
        <header className={classes.header}>
          {Title}
          <Typography className={classes.intro}>{intro}</Typography>
          <FiltersWarning />
        </header>
        <div className={classes.body}>{children}</div>
      </div>
    </>
  )
}
