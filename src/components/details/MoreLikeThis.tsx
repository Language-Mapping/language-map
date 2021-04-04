import React, { FC, useState } from 'react'
import { Route } from 'react-router-dom'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { IoIosPeople } from 'react-icons/io'

import { routes } from 'components/config/api'
import { SwatchOnly } from 'components/legend'
import { Chip } from 'components/details'

import * as Types from './types'
import { LocationLink } from './LocationLink'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      fontSize: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '0.5rem 0 0.75rem',
      '& > * + *': {
        marginLeft: '0.35rem',
      },
    },
  })
)

export const MoreLikeThis: FC<Types.TonsOfData> = (props) => {
  const { data, children } = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const {
    'World Region': WorldRegion,
    Country,
    countryImg,
    Macrocommunity: macro,
    worldRegionColor,
  } = data

  // TODO: use TS on all mid-route paths, e.g. "World Region"
  return (
    <div className={classes.root}>
      <Route path="/Explore/Language/:language/:id" exact>
        <LocationLink
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          data={data}
        />
      </Route>
      <Chip
        text={WorldRegion}
        to={`${routes.explore}/World Region/${WorldRegion}`}
        icon={<SwatchOnly backgroundColor={worldRegionColor} />}
      />
      {Country.map((countryName, i) => (
        <Chip
          key={countryName}
          text={countryName}
          to={`${routes.explore}/Country/${countryName}`}
          icon={
            <img
              className="country-flag"
              alt={`${countryName} flag`}
              src={countryImg[i].url}
            />
          }
        />
      ))}
      {macro &&
        macro.map((macroName, i) => (
          <Chip
            key={macroName}
            text={macroName}
            to={`${routes.explore}/Macrocommunity/${macroName}`}
            icon={<IoIosPeople />}
          />
        ))}
      {children}
    </div>
  )
}
