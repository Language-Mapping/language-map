import React, { FC } from 'react'
import { Link as RouterLink, Route, Switch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'

import { CustomCard, CardList } from 'components/explore'
import * as Types from './types'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    divider: { marginBottom: '1.5em' },
    addlNeighbsList: {
      margin: 0,
      fontSize: '1rem',
    },
    explanation: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      margin: '0.5rem 0',
    },
    mainHeading: {
      marginBottom: 0,
    },
    sectionHeading: {
      marginTop: '1rem',
    },
    verticalAlign: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: '0.25em',
      },
    },
  })
)

export const NeighborhoodList: FC<Types.NeighborhoodListProps> = (props) => {
  const { data, isInstance } = props
  const classes = useStyles()
  const {
    addlNeighborhoods,
    Neighborhood,
    'Primary Locations': primaryLocs,
    Town,
    instanceIDs = [],
  } = data || {}
  const locName = Neighborhood || Town
  const primaries = (isInstance ? [locName] : primaryLocs) || []
  const locRouteName = Town ? 'Town' : 'Neighborhood'
  let additional

  if (isInstance) additional = data['Additional Neighborhoods']
  else additional = addlNeighborhoods
  const gahhhh = additional || []

  const More = (
    <>
      <Typography
        variant="overline"
        component="h4"
        className={classes.sectionHeading}
      >
        Additional neighborhoods (NYC only)
      </Typography>
      <ul className={classes.addlNeighbsList}>
        {gahhhh.map((place) => (
          <li key={place}>
            <Link component={RouterLink} to={`/Explore/Neighborhood/${place}`}>
              {place}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <Typography className={classes.root}>
      <Typography
        variant="h6"
        component="h3"
        className={`${classes.verticalAlign} ${classes.mainHeading}`}
      >
        <BiMapPin /> Locations
      </Typography>
      <Typography component="p" className={classes.explanation}>
        <Switch>
          <Route path="/details">
            NYC neighborhood or metro region town for this community
          </Route>
          <Route>
            NYC neighborhoods or towns in the metro region where the language
            community has a significant site, marked by a point on the map
          </Route>
        </Switch>
      </Typography>
      <CardList>
        {primaries.map((loc, i) => {
          const footer = (
            <Switch>
              <Route path="/details">View more languages spoken in {loc}</Route>
              <Route>View details and show in map</Route>
            </Switch>
          )

          let url // TODO: de-shabbify, wire up w/Town

          if (!isInstance)
            url = `/details/${instanceIDs ? instanceIDs[i] : 999999}`
          else url = `/Explore/${locRouteName}/${loc}`

          return <CustomCard key={loc} title={loc} url={url} footer={footer} />
        })}
      </CardList>
      {gahhhh.length ? More : null}
    </Typography>
  )
}
