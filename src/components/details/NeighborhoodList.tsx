import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'

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
    },
    sectionHeading: {
      marginTop: '1rem',
    },
  })
)

export const NeighborhoodList: FC<Types.NeighborhoodListProps> = (props) => {
  const { data } = props
  const classes = useStyles()
  const {
    'Additional Neighborhoods': addlNeighbs,
    'Primary Neighborhood': primaryNeighb,
    Town,
  } = data
  const locName = primaryNeighb || Town
  const exploreRoute = primaryNeighb ? 'Neighborhood' : 'Town' // shaaaky

  return (
    <Typography className={classes.root}>
      <Typography variant="h5">
        <BiMapPin />
        Locations
      </Typography>
      <Typography component="p" className={classes.explanation}>
        Neighborhoods and towns where there this language is spoken AND there's
        a point for them (???).
      </Typography>
      <Typography variant="h6" className={classes.sectionHeading}>
        The main one/s
      </Typography>
      <Typography component="p" className={classes.explanation} paragraph>
        View neighborhood/s or town/s where this is the nicely-worded, carefully
        presented and curated way of describing this.{' '}
        <b>THIS WILL BE A CARD, DON'T WORRY</b>
      </Typography>
      <Link component={RouterLink} to={`/Explore/${exploreRoute}/${locName}`}>
        {locName}
      </Link>
      {addlNeighbs && (
        <>
          <Typography variant="h6" className={classes.sectionHeading}>
            Everybody else
          </Typography>
          <Typography component="p" className={classes.explanation}>
            Other neighborhoods where this language is spoken. CAN'T WRITE USER
            DOCUMENTATION TONIGHT, I JUST CAN'T.
          </Typography>
          <ul className={classes.addlNeighbsList}>
            {addlNeighbs.map((place) => (
              <li key={place}>
                <Link
                  component={RouterLink}
                  to={`/Explore/Neighborhood/${place}`}
                >
                  {place}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Typography>
  )
}
