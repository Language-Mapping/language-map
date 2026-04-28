import React, { FC } from 'react'
import { Link as RouteLink } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Breadcrumbs, Typography, Link } from '@mui/material'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottomColor: theme.palette.text.disabled,
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
