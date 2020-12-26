import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  const { data } = props
  const classes = useStyles()
  const {
    addlNeighborhoods,
    'Primary Neighborhood': primaryNeighb,
    'Primary Locations': primaryLocs,
    Town,
    instanceIDs = [],
    instanceDescrips = [],
  } = data || {}
  const locName = primaryNeighb || Town
  const exploreRoute = primaryNeighb ? 'Neighborhood' : 'Town' // shaaaky
  const primaries = primaryLocs || [locName]

  return (
    <Typography className={classes.root}>
      <Typography variant="h5" className={classes.verticalAlign}>
        <BiMapPin />
        Primary Location/s
      </Typography>
      <Typography component="p" className={classes.explanation}>
        Neighborhoods and towns where there this language is spoken AND there's
        a point for them (???). This doesn't mean, liiiike, it's not spoken
        elsewhere, there's just not a point represented in this project...
      </Typography>
      <Link component={RouterLink} to={`/Explore/${exploreRoute}/${locName}`}>
        {locName}
      </Link>
      {primaries && (
        <CardList>
          {primaries.map((loc, i) => {
            let footer

            if (instanceDescrips.length)
              footer = `${instanceDescrips[i].slice(0, 125)}...`

            return (
              <CustomCard
                key={loc}
                title={loc}
                url={`/details/${instanceIDs ? instanceIDs[i] : 999999}`}
                footer={footer}
              />
            )
          })}
        </CardList>
      )}
      {addlNeighborhoods && (
        <>
          <Typography variant="h6" className={classes.sectionHeading}>
            Additional neighborhoods
          </Typography>
          <Typography component="p" className={classes.explanation} paragraph>
            Other neighborhoods where this language is spoken.
          </Typography>
          <ul className={classes.addlNeighbsList}>
            {addlNeighborhoods.map((place) => (
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
