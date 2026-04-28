import React, { FC } from 'react'
import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import { Link } from '@mui/material'
import { useLocation, Link as RouterLink, useMatch } from 'react-router-dom'
import { BiHomeAlt } from 'react-icons/bi'

import { CurrentDetailCrumb } from './CurrentDetailCrumb'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      overflow: 'hidden',
      [theme.breakpoints.down('md')]: {
        overflowX: 'auto', // Easter egg: scroll sideways on small screens
      },
      '& > :last-child': {
        alignItems: 'center',
        color: theme.palette.text.secondary,
        display: 'inline-flex',
        whiteSpace: 'nowrap',
        flex: 1,
      },
      '& > a > svg': {
        color: theme.palette.text.primary, // gray icon = silly if others white
      },
      '& > :last-child > *': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    capital: {
      textTransform: 'capitalize',
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
  const isLangInstance = useMatch('/Explore/Language/:language/:id') !== null

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
        return (
          <React.Fragment key={value}>
            {includeSeparator && Separator}
            {(last && (
              <span>
                {isLangInstance ? (
                  <CurrentDetailCrumb />
                ) : (
                  <span className={classes.capital}>{value}</span>
                )}
              </span>
            )) || (
              <Link to={to} component={RouterLink} className={classes.capital}>
                {value}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
