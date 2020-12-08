import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import { BiMapPin } from 'react-icons/bi'

import { useStyles } from './styles'
import * as Types from './types'

export const NeighborhoodList: FC<Types.NeighborhoodList> = (props) => {
  const { town, neighborhoods } = props
  const classes = useStyles()

  return (
    <Typography className={classes.neighborhoods}>
      <BiMapPin />
      {neighborhoods &&
        neighborhoods.split(', ').map((place, i) => (
          <React.Fragment key={place}>
            {i !== 0 && <span className={classes.separator}>|</span>}
            <RouterLink to={`/Explore/Neighborhood/${place}`}>
              {place}
            </RouterLink>
          </React.Fragment>
        ))}
      {/* At least for now, not linking to Towns */}
      {!neighborhoods && town}
    </Typography>
  )
}
