import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Breadcrumbs, Link } from '@material-ui/core'
import { useLocation, Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '0.8rem',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      '& a': {
        color: theme.palette.primary.main,
      },
      '& *': {
        fontSize: 'inherit',
      },
    },
    separator: {
      marginLeft: '0.45em',
      marginRight: '0.45em',
    },
  })
)

const RouterBreadcrumbs: FC = () => {
  const classes = useStyles()
  const loc = useLocation()
  const pathnames = loc.pathname.split('/').filter((x) => x)

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className={classes.root}
      classes={{ separator: classes.separator }}
    >
      <RouterLink to="/">Home</RouterLink>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1
        const to = `/${pathnames.slice(0, index + 1).join('/')}`

        return last ? (
          <Typography color="textSecondary" key={to}>
            {value}
          </Typography>
        ) : (
          <Link to={to} key={to} component={RouterLink}>
            {value}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default RouterBreadcrumbs
