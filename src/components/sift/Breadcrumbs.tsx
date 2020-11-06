import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { BiHomeAlt } from 'react-icons/bi'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      color: theme.palette.text.secondary,
      display: 'flex',
      fontSize: '0.8em',
      marginLeft: '0.4em',
      padding: '0.15em 0',
      // SHAKY calc with that close btn, but couldn't make ellipsis otherwise
      width: 'calc(100% - 32px)',
      '& a': {
        color: theme.palette.text.primary,
      },
      '& > *': {
        alignItems: 'center',
        display: 'inline-flex',
        fontSize: 'inherit',
      },
      '& > :last-child': {
        flex: 1,
        minWidth: 0,
      },
      '& > :last-child > *': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    homeLink: {
      '& svg': {
        fontSize: '1.2em',
      },
    },
    separator: {
      marginLeft: '0.25em',
      marginRight: '0.25em',
    },
  })
)

export const Breadcrumbs: FC = (props) => {
  const classes = useStyles()
  const loc = useLocation()
  const pathnames = loc.pathname.split('/').filter((x) => x)

  if (pathnames[0] !== 'Explore') return null // less useful on non-Explore's

  return (
    <div aria-label="breadcrumb" className={classes.root}>
      <RouterLink to="/" title="Home" className={classes.homeLink}>
        <BiHomeAlt />
      </RouterLink>
      <span className={classes.separator}>/</span>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1
        const to = `/${pathnames.slice(0, index + 1).join('/')}`

        // Last item gets no link, subtler text color, and ellipsis overflow.
        // Need the second child to make ellipsis work.
        // CRED: Chris to the rescue: css-tricks.com/flexbox-truncated-text/
        return last ? (
          <span key={value}>
            <span>{value}</span>
          </span>
        ) : (
          <>
            <Link to={to} key={value} component={RouterLink}>
              {value}
            </Link>
            <span className={classes.separator}>/</span>
          </>
        )
      })}
    </div>
  )
}
