import React, { FC } from 'react'
import { Link as RouterLink, Route, Switch } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, Link } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'

import { CustomCard, CardListWrap } from 'components/explore'
import { Explanation, UItextFromAirtable } from 'components/generic'
import * as Types from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  return (
    <Switch>
      <Route path="/Explore/Language/:language/:id" exact>
        View more languages spoken in {text}
      </Route>
      <Route>View details and show in map</Route>
    </Switch>
  )
}

export const NeighborhoodList: FC<Types.DetailedIntroProps> = (props) => {
  const { data, isInstance } = props
  const classes = useStyles()
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
        <Switch>
          <Route path="/Explore/Language/:language/:id" exact>
            {(data['Additional Neighborhoods'] || []).map((place) => (
              <li key={place}>
                <Link
                  component={RouterLink}
                  to={`/Explore/Neighborhood/${place}`}
                >
                  {place}
                </Link>
              </li>
            ))}
          </Route>
          <Route>
            {addlNeighborhoods?.map((place) => (
              <li key={place}>
                <Link
                  component={RouterLink}
                  to={`/Explore/Neighborhood/${place}`}
                >
                  {place}
                </Link>
              </li>
            ))}
          </Route>
        </Switch>
      </ul>
    </>
  )

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
        <Switch>
          <Route path="/Explore/Language/:language/:id" exact>
            <UItextFromAirtable id="details-neighb-loc-list" rootElemType="p" />
          </Route>
          <Route>
            <UItextFromAirtable id="lang-profile-loc-list" />
          </Route>
        </Switch>
      </Explanation>
      <CardListWrap>
        <Switch>
          {/* Inside the Details "Locations" popout */}
          <Route path="/Explore/Language/:language/:id" exact>
            <CustomCard
              title={locName}
              // intro={`${data.County[0]}`} // TODO: County as intro
              url={`/Explore/${locRouteName}/${locName}`}
              footer={<CardFooter text={locName} />}
            />
          </Route>
          <Route>
            {primaryLocs.map((loc, i) => {
              const url = `/Explore/Language/${name}/${
                instanceIDs.length ? instanceIDs[i] : 999999
              }`

              return (
                <CustomCard
                  key={loc}
                  title={loc}
                  intro={data.County[i]}
                  url={url}
                  footer={<CardFooter text={loc} />}
                />
              )
            })}
          </Route>
        </Switch>
      </CardListWrap>
      {gahhhh.length ? More : null}
    </>
  )
}
