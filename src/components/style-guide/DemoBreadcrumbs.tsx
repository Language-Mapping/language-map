import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Breadcrumbs, Typography, Link } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottomColor: theme.palette.text.hint,
      borderBottomStyle: 'dashed',
      borderBottomWidth: 1,
      marginTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      paddingTop: theme.spacing(4),
    },
  })
)

// TODO: get this whole file out of Demo and into components dir for reuse in
// other pages like About, or more likely a `<Layout>` wrapper.
export const DemoBreadcrumbs: FC = () => {
  const classes = useStyles()

  return (
    <Breadcrumbs aria-label="breadcrumb" separator=">" className={classes.root}>
      <Link component={RouteLink} color="inherit" to="/">
        Home
      </Link>
      <Typography color="textPrimary">Style Guide Demo</Typography>
    </Breadcrumbs>
  )
}
