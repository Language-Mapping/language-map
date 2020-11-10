import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { BiHomeAlt } from 'react-icons/bi'

import { toProperCase } from '../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      overflowX: 'hidden',
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
      '& > :last-child': {
        color: theme.palette.text.secondary,
        flex: 1,
        minWidth: 0,
      },
      '& > :last-child > *': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    separator: {
      color: theme.palette.text.secondary,
      marginLeft: '0.2em',
      marginRight: '0.2em',
    },
  })
)

export const Breadcrumbs: FC = () => {
  const classes = useStyles()
  const loc = useLocation()
  const pathnames = loc.pathname.split('/').filter((x) => x)
  const includeSeparator = pathnames.length !== 0
  const Separator = <span className={classes.separator}>/</span>

  return (
    <div aria-label="breadcrumb" className={classes.root}>
      <RouterLink to="/" title="Home" style={{ display: 'flex' }}>
        <BiHomeAlt />
      </RouterLink>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1
        const to = `/${pathnames.slice(0, index + 1).join('/')}`

        // Last item gets no link, subtler text color, and ellipsis overflow.
        // Need the second child to make ellipsis work.
        // CRED: Chris to the rescue: css-tricks.com/flexbox-truncated-text/
        return last ? (
          <React.Fragment key={value}>
            {includeSeparator && Separator}
            <span>
              <span>{toProperCase(value)}</span>
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment key={value}>
            {includeSeparator && Separator}
            <Link to={to} component={RouterLink}>
              {toProperCase(value)}
            </Link>
          </React.Fragment>
        )
      })}
    </div>
  )
}
