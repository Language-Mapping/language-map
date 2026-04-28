import React, { FC } from 'react'
import { Link as RouterLink, useMatch } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Typography, Link } from '@mui/material'
import { BiMapPin } from 'react-icons/bi'

import { CustomCard, CardListWrap } from 'components/explore'
import { Explanation, UItextFromAirtable } from 'components/generic'
import { sortArrOfObjects } from 'components/legend/utils'
import { DetailedIntroProps } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: { marginBottom: '1.5em' },
    addlNeighbsList: {
      margin: 0,
      fontSize: '0.85rem',
    },
    explanation: {
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      margin: '0.5rem 0',
    },
    mainHeading: {
      marginBottom: '0.5rem',
    },
    sectionHeading: {
      marginTop: '1rem',
    },
    verticalAlign: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        marginRight: '0.25em',
        color: theme.palette.text.secondary,
        fontSize: '0.85em',
      },
    },
  })
)

const CardFooter: FC<{ text?: string }> = ({ text }) => {
  const isLangInstance = useMatch('/Explore/Language/:language/:id') !== null

  if (isLangInstance) return <>View more languages spoken in {text}</>

  return <>View details and show in map</>
}

export const NeighborhoodList: FC<DetailedIntroProps> = (props) => {
  const { data, isInstance } = props
  const classes = useStyles()
  const isLangInstance = useMatch('/Explore/Language/:language/:id') !== null
  const {
    addlNeighborhoods,
    Neighborhood,
    'Primary Locations': primaryLocs = [],
    Town,
    instanceIDs = [],
    name,
  } = data || {}
  const locName = Neighborhood || Town
  const locRouteName = Town ? 'Town' : 'Neighborhood'
  let additional

  if (isInstance) additional = data['Additional Neighborhoods'] || []
  else additional = addlNeighborhoods
  const gahhhh = additional || []
  let pickedNeighbs: string[] = []

  if (isLangInstance) pickedNeighbs = data['Additional Neighborhoods'] || []
  else pickedNeighbs = addlNeighborhoods || []

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
        {pickedNeighbs.map((place) => (
          <li key={place}>
            <Link component={RouterLink} to={`/Explore/Neighborhood/${place}`}>
              {place}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )

  const sortedByLoc = primaryLocs
    .map((loc, i) => ({
      loc,
      county: data.County[i],
      id: instanceIDs[i] || 999999,
    }))
    .sort(sortArrOfObjects<{ loc: string; county: string; id: number }>('loc'))

  return (
    <>
      <Typography
        variant="h5"
        component="h3"
        className={`${classes.verticalAlign} ${classes.mainHeading}`}
      >
        <BiMapPin /> Sites
      </Typography>
      <Explanation>
        {isLangInstance ? (
          <UItextFromAirtable id="details-neighb-loc-list" rootElemType="p" />
        ) : (
          <UItextFromAirtable id="lang-profile-loc-list" />
        )}
      </Explanation>
      <CardListWrap>
        {isLangInstance ? (
          <CustomCard
            title={locName}
            url={`/Explore/${locRouteName}/${locName}`}
            footer={<CardFooter text={locName} />}
          />
        ) : (
          sortedByLoc.map(({ loc, county, id }, i) => (
            <CustomCard
              key={loc}
              title={loc}
              intro={county}
              url={`/Explore/Language/${name}/${id}`}
              footer={<CardFooter text={loc} />}
              timeout={350 + i * 250}
            />
          ))
        )}
      </CardListWrap>
      {gahhhh.length ? More : null}
    </>
  )
}
