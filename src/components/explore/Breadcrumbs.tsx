import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
// import { CircularProgress, Link } from '@material-ui/core'
import { Link } from '@material-ui/core'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { BiHomeAlt } from 'react-icons/bi'

// import { useDetailsNew } from 'components/details/hooks' // TODO
import { CurrentCrumbProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: 'center',
      display: 'flex',
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
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

const CurrentCrumb: FC<CurrentCrumbProps> = (props) => {
  // TODO: new hook or at least AT w/useParams (or useroutematch?)
  const classes = useStyles()
  const { value, basePath } = props
  // const { data: feature } = useDetails()

  // if (value === 'details' || basePath !== 'details' || !feature) {
  if (value === 'details' || basePath !== 'details') {
    return <span className={classes.capital}>{value}</span>
  }

  return null
  // // TODO:
  // // if (!feature) return <CircularProgress size={12} />

  // const { Language, Neighborhood, Town } = feature
  // const place = Neighborhood ? Neighborhood.split(', ')[0] : Town

  // return (
  //   <>
  //     {Language}
  //     {` — ${place}`}
  //   </>
  // )
}

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
        return (
          <React.Fragment key={value}>
            {includeSeparator && Separator}
            {(last && (
              <span>
                <CurrentCrumb value={value} basePath={pathnames[0]} />
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
